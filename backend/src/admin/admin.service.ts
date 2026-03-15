import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getKpis(timeframe?: string) {
        let dateFilter = undefined;

        if (timeframe === 'today') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            dateFilter = { gte: startOfDay };
        } else if (timeframe === 'month') {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            dateFilter = { gte: startOfMonth };
        }

        const userWhere = dateFilter ? { createdAt: dateFilter } : undefined;
        const aptWhere = dateFilter ? { createdAt: dateFilter } : undefined;

        const totalUsers = await this.prisma.user.count({ where: userWhere });
        const totalPatients = await this.prisma.user.count({ where: { role: 'PATIENT', ...userWhere } });
        const totalDoctors = await this.prisma.user.count({ where: { role: 'PRACTITIONER', ...userWhere } });

        const totalConsultations = await this.prisma.appointment.count({ where: aptWhere });
        const completedConsultations = await this.prisma.appointment.count({ where: { status: 'COMPLETED', ...aptWhere } });

        return {
            totalUsers,
            totalPatients,
            totalDoctors,
            totalConsultations,
            completedConsultations,
        };
    }

    async getSystemLogs() {
        return this.prisma.systemLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to recent logs
        });
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            include: {
                practitionerProfile: {
                    include: { appointments: { select: { id: true, status: true } } }
                }, // Includes KYC status and Doctor appointments
                appointmentsAsPatient: { select: { id: true, status: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            kyc: u.practitionerProfile ? (u.practitionerProfile.kycVerified ? 'Verified' : 'Pending') : null,
            kycPhoto: u.practitionerProfile ? u.practitionerProfile.kycPhoto : null,
            consultations: u.role === 'PRACTITIONER' && u.practitionerProfile ? u.practitionerProfile.appointments.length : u.appointmentsAsPatient.length,
            rating: u.role === 'PRACTITIONER' ? '4.8' : null, // Mocking until feedback system exists
            plan: u.role === 'PATIENT' ? 'Premium' : null, // Mocking until sub system exists
            orders: u.role === 'PATIENT' ? Math.floor(Math.random() * 5) : 0,
        }));
    }

    async verifyPractitionerKyc(userId: string) {
        let profile = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (!profile) {
            profile = await this.prisma.practitionerProfile.create({
                data: { userId, kycVerified: true }
            });
        } else {
            profile = await this.prisma.practitionerProfile.update({
                where: { id: profile.id },
                data: { kycVerified: true },
            });
        }
        await this.prisma.systemLog.create({
            data: { action: "Doctor KYC Verified", details: `Admin verified KYC for User ID: ${userId}`, level: "INFO" }
        });
        return profile;
    }

    async rejectPractitionerKyc(userId: string) {
        const profile = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (profile) {
            return this.prisma.practitionerProfile.update({
                where: { id: profile.id },
                data: { kycVerified: false }
            });
        }
        return { message: "Doctor profile not found." };
    }

    async updateUser(userId: string, data: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { name: data.name }
        });
    }

    async updateUserStatus(userId: string, status: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { status }
        });
        await this.prisma.systemLog.create({
            data: { action: `User ${status}`, details: `Admin changed status of ${user.name} to ${status}`, level: status === 'SUSPENDED' ? "WARNING" : "INFO" }
        });
        return user;
    }

    async createUser(data: any) {
        const { email, password, name, role } = data;
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists) throw new ConflictException("User with this email already exists");

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                role: role || 'PATIENT'
            }
        });

        if (role === 'PRACTITIONER') {
            await this.prisma.practitionerProfile.create({
                data: {
                    userId: user.id,
                    kycVerified: false,
                }
            });
        }
        return { message: "User created successfully", user };
    }

    async deleteUser(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { practitionerProfile: true } });
        if (user) {
            // Cascade delete dependencies
            await this.prisma.appointment.deleteMany({ where: { patientId: userId } });
            if (user.practitionerProfile) {
                await this.prisma.appointment.deleteMany({ where: { practitionerId: user.practitionerProfile.id } });
                await this.prisma.practitionerProfile.delete({ where: { userId } });
            }
            const deleted = await this.prisma.user.delete({ where: { id: userId } });

            await this.prisma.systemLog.create({
                data: { action: "User Deleted", details: `Admin permanently deleted user ${deleted.name} (${deleted.email})`, level: "CRITICAL" }
            });
            return deleted;
        }
        return { success: false };
    }

    // New Endpoint: All Platform Consultations
    async getAllConsultations() {
        const apts = await this.prisma.appointment.findMany({
            include: {
                patient: { select: { name: true } },
                practitioner: {
                    include: { user: { select: { name: true } } }
                }
            },
            orderBy: { startTime: 'desc' }
        });

        return apts.map(apt => ({
            id: apt.id,
            patientName: apt.patient.name,
            doctorName: apt.practitioner?.user?.name || "Unknown",
            date: apt.startTime,
            status: apt.status,
            type: 'Video Consult', // Mocking type as it's not in schema currently
            amount: '₹800' // Mocking amount
        }));
    }

    async cancelConsultation(id: string) {
        const apt = await this.prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
        await this.prisma.systemLog.create({
            data: { action: "Consultation Force Cancelled", details: `Admin cancelled appointment ID: ${id}`, level: "WARNING" }
        });
        return apt;
    }

    async deleteConsultation(id: string) {
        return this.prisma.appointment.delete({
            where: { id }
        });
    }

    // E-Commerce
    async getAllProducts() {
        return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async createProduct(data: any) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description || '',
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
            }
        });
    }

    async updateProduct(id: string, data: any) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.price && { price: parseFloat(data.price) }),
                ...(data.stock !== undefined && { stock: parseInt(data.stock, 10) }),
            }
        });
    }

    async deleteProduct(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }

    async getAllOrders() {
        return this.prisma.order.findMany({
            include: { user: { select: { name: true } }, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateOrderStatus(id: string, status: string) {
        return this.prisma.order.update({ where: { id }, data: { status } });
    }
}

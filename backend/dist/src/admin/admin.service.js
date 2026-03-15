"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKpis(timeframe) {
        let dateFilter = undefined;
        if (timeframe === 'today') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            dateFilter = { gte: startOfDay };
        }
        else if (timeframe === 'month') {
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
            take: 100
        });
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            include: {
                practitionerProfile: {
                    include: { appointments: { select: { id: true, status: true } } }
                },
                appointmentsAsPatient: { select: { id: true, status: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            kyc: u.practitionerProfile ? (u.practitionerProfile.kycVerified ? 'Verified' : 'Pending') : null,
            kycPhoto: u.practitionerProfile ? u.practitionerProfile.kycPhoto : null,
            consultations: u.role === 'PRACTITIONER' && u.practitionerProfile ? u.practitionerProfile.appointments.length : u.appointmentsAsPatient.length,
            rating: u.role === 'PRACTITIONER' ? '4.8' : null,
            plan: u.role === 'PATIENT' ? 'Premium' : null,
            orders: u.role === 'PATIENT' ? Math.floor(Math.random() * 5) : 0,
        }));
    }
    async verifyPractitionerKyc(userId) {
        let profile = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (!profile) {
            profile = await this.prisma.practitionerProfile.create({
                data: { userId, kycVerified: true }
            });
        }
        else {
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
    async rejectPractitionerKyc(userId) {
        const profile = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (profile) {
            return this.prisma.practitionerProfile.update({
                where: { id: profile.id },
                data: { kycVerified: false }
            });
        }
        return { message: "Doctor profile not found." };
    }
    async updateUser(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { name: data.name }
        });
    }
    async updateUserStatus(userId, status) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { status }
        });
        await this.prisma.systemLog.create({
            data: { action: `User ${status}`, details: `Admin changed status of ${user.name} to ${status}`, level: status === 'SUSPENDED' ? "WARNING" : "INFO" }
        });
        return user;
    }
    async createUser(data) {
        const { email, password, name, role } = data;
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists)
            throw new common_1.ConflictException("User with this email already exists");
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
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { practitionerProfile: true } });
        if (user) {
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
            type: 'Video Consult',
            amount: '₹800'
        }));
    }
    async cancelConsultation(id) {
        const apt = await this.prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
        await this.prisma.systemLog.create({
            data: { action: "Consultation Force Cancelled", details: `Admin cancelled appointment ID: ${id}`, level: "WARNING" }
        });
        return apt;
    }
    async deleteConsultation(id) {
        return this.prisma.appointment.delete({
            where: { id }
        });
    }
    async getAllProducts() {
        return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async createProduct(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description || '',
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
            }
        });
    }
    async updateProduct(id, data) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.price && { price: parseFloat(data.price) }),
                ...(data.stock !== undefined && { stock: parseInt(data.stock, 10) }),
            }
        });
    }
    async deleteProduct(id) {
        return this.prisma.product.delete({ where: { id } });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: { user: { select: { name: true } }, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateOrderStatus(id, status) {
        return this.prisma.order.update({ where: { id }, data: { status } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map
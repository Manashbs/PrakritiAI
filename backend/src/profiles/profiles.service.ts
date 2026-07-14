import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const profile = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                practitionerProfile: true,
            },
        });

        if (!profile) throw new NotFoundException('User not found');
        const { passwordHash, ...result } = profile;
        return result;
    }

    async getAllPractitioners() {
        return this.prisma.practitionerProfile.findMany({
            where: { kycVerified: true },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async updatePractitionerProfile(userId: string, data: any) {
        return this.prisma.practitionerProfile.upsert({
            where: { userId },
            update: {
                specialties: data.specialties,
                bio: data.bio,
                consultationFee: data.consultationFee,
                kycVerified: data.kycVerified,
            },
            create: {
                userId,
                specialties: data.specialties || [],
                bio: data.bio || '',
                consultationFee: data.consultationFee || 0,
                kycVerified: data.kycVerified || false,
            },
        });
    }

    async uploadKycDocument(userId: string, photo: string) {
        // Find existing profile or create a minimal one to attach the photo
        const existing = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (existing) {
            await this.prisma.practitionerProfile.update({
                where: { id: existing.id },
                data: { kycPhoto: photo }
            });
        } else {
            await this.prisma.practitionerProfile.create({
                data: { userId, kycPhoto: photo }
            });
        }

        await this.prisma.systemLog.create({
            data: { action: "KYC Photo Submitted", details: `Doctor ID: ${userId} uploaded a verification selfie.`, level: "INFO" }
        });

        return { success: true, message: "KYC verification photo submitted successfully." };
    }
}

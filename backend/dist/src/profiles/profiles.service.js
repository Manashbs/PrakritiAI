"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProfilesService = class ProfilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const profile = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                practitionerProfile: true,
            },
        });
        if (!profile)
            throw new common_1.NotFoundException('User not found');
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
    async updatePractitionerProfile(userId, data) {
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
    async uploadKycDocument(userId, photo) {
        const existing = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (existing) {
            await this.prisma.practitionerProfile.update({
                where: { id: existing.id },
                data: { kycPhoto: photo }
            });
        }
        else {
            await this.prisma.practitionerProfile.create({
                data: { userId, kycPhoto: photo }
            });
        }
        await this.prisma.systemLog.create({
            data: { action: "KYC Photo Submitted", details: `Doctor ID: ${userId} uploaded a verification selfie.`, level: "INFO" }
        });
        return { success: true, message: "KYC verification photo submitted successfully." };
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map
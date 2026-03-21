import { PrismaService } from '../prisma.service';
export declare class ProfilesService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        practitionerProfile: {
            id: string;
            specialties: string[];
            bio: string | null;
            consultationFee: number;
            kycVerified: boolean;
            kycPhoto: string | null;
            userId: string;
        };
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        resetPasswordToken: string | null;
        status: string;
        resetPasswordExpires: Date | null;
    }>;
    getAllPractitioners(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        kycPhoto: string | null;
        userId: string;
    })[]>;
    updatePractitionerProfile(userId: string, data: any): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        kycPhoto: string | null;
        userId: string;
    }>;
    uploadKycDocument(userId: string, photo: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

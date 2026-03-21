import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getMyProfile(req: any): Promise<{
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
    updatePractitionerProfile(req: any, body: any): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        kycPhoto: string | null;
        userId: string;
    }>;
    uploadKycDocument(req: any, photo: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

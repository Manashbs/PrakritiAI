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
            userId: string;
            kycPhoto: string | null;
        };
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        status: string;
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
        userId: string;
        kycPhoto: string | null;
    })[]>;
    updatePractitionerProfile(req: any, body: any): Promise<{
        id: string;
        specialties: string[];
        bio: string | null;
        consultationFee: number;
        kycVerified: boolean;
        userId: string;
        kycPhoto: string | null;
    }>;
    uploadKycDocument(req: any, photo: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

import { PrismaService } from '../prisma.service';
export declare class DoctorNotesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPractitionerProfile;
    saveNote(practitionerUserId: string, data: {
        patientId: string;
        content: string;
        isVisibleToPatient?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        practitionerId: string;
        patientId: string;
        content: string;
        isVisibleToPatient: boolean;
    }>;
    getNotesForPatient(practitionerUserId: string, patientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        practitionerId: string;
        patientId: string;
        content: string;
        isVisibleToPatient: boolean;
    }[]>;
    getPatientNotes(patientId: string): Promise<({
        practitioner: {
            user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        practitionerId: string;
        patientId: string;
        content: string;
        isVisibleToPatient: boolean;
    })[]>;
}

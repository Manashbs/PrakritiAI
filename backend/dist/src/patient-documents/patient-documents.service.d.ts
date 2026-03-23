import { PrismaService } from '../prisma.service';
export declare class PatientDocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(patientId: string, data: {
        label: string;
        fileType: string;
        base64Content: string;
        appointmentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        patientId: string;
        appointmentId: string | null;
        label: string;
        fileType: string;
        base64Content: string;
    }>;
    getMyDocuments(patientId: string): Promise<{
        id: string;
        createdAt: Date;
        appointmentId: string;
        label: string;
        fileType: string;
        base64Content: string;
    }[]>;
    getPatientDocuments(patientId: string): Promise<{
        id: string;
        createdAt: Date;
        label: string;
        fileType: string;
        base64Content: string;
    }[]>;
}

import { PrismaService } from '../prisma.service';
export declare class TeleconsultationService {
    private prisma;
    constructor(prisma: PrismaService);
    saveSessionNotes(appointmentId: string, practitionerId: string, notes: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        meetLink: string | null;
        practitionerId: string;
        patientId: string;
    }>;
    markConsultationComplete(appointmentId: string, practitionerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        notes: string | null;
        meetLink: string | null;
        practitionerId: string;
        patientId: string;
    }>;
}

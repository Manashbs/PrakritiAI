import { PrismaService } from '../prisma.service';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    bookAppointment(patientId: string, data: any): Promise<{
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
    getPatientAppointments(patientId: string): Promise<({
        practitioner: {
            user: {
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
        };
    } & {
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
    })[]>;
    getPractitionerAppointments(userId: string): Promise<({
        patient: {
            email: string;
            name: string;
        };
    } & {
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
    })[]>;
    completeAppointment(appointmentId: string, requestingUserId: string): Promise<{
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
    bookForPatient(practitionerUserId: string, data: {
        patientId: string;
        startTime: string;
        notes?: string;
    }): Promise<{
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

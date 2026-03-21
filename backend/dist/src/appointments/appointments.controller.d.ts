import { AppointmentsService } from './appointments.service';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    bookAppointment(req: any, body: any): Promise<{
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
    getMyAppointments(req: any): Promise<({
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
    })[] | ({
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
}

import { PrismaService } from '../prisma.service';
export declare class PrescriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPrescription(practitionerUserId: string, data: any): Promise<{
        medicines: {
            id: string;
            name: string;
            dosage: string;
            frequency: string;
            timing: string;
            duration: string;
            prescriptionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        practitionerId: string;
        patientId: string;
        lifestyle: string | null;
        appointmentId: string | null;
    }>;
    getPatientPrescriptions(patientId: string): Promise<({
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
        medicines: {
            id: string;
            name: string;
            dosage: string;
            frequency: string;
            timing: string;
            duration: string;
            prescriptionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        practitionerId: string;
        patientId: string;
        lifestyle: string | null;
        appointmentId: string | null;
    })[]>;
    getPractitionerPrescriptions(practitionerUserId: string): Promise<({
        patient: {
            email: string;
            name: string;
        };
        medicines: {
            id: string;
            name: string;
            dosage: string;
            frequency: string;
            timing: string;
            duration: string;
            prescriptionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        practitionerId: string;
        patientId: string;
        lifestyle: string | null;
        appointmentId: string | null;
    })[]>;
}

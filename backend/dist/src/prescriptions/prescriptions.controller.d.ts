import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private readonly prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    createPrescription(req: any, body: any): Promise<{
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
    getPatientPrescriptions(req: any): Promise<({
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
            userId: string;
            kycPhoto: string | null;
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
    getPractitionerPrescriptions(req: any): Promise<({
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

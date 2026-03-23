import { DoctorNotesService } from './doctor-notes.service';
export declare class DoctorNotesController {
    private readonly service;
    constructor(service: DoctorNotesService);
    saveNote(req: any, body: {
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
    getForPatient(req: any, patientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        practitionerId: string;
        patientId: string;
        content: string;
        isVisibleToPatient: boolean;
    }[]>;
    myNotes(req: any): Promise<({
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

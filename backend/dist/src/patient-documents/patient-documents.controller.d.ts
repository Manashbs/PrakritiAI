import { PatientDocumentsService } from './patient-documents.service';
export declare class PatientDocumentsController {
    private readonly service;
    constructor(service: PatientDocumentsService);
    upload(req: any, body: {
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
    myDocuments(req: any): Promise<{
        id: string;
        createdAt: Date;
        appointmentId: string;
        label: string;
        fileType: string;
        base64Content: string;
    }[]>;
    patientDocuments(patientId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        label: string;
        fileType: string;
        base64Content: string;
    }[]>;
}

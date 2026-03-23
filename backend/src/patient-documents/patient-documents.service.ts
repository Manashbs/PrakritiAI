import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PatientDocumentsService {
    constructor(private prisma: PrismaService) {}

    // Patient uploads a document
    async uploadDocument(patientId: string, data: {
        label: string;
        fileType: string;
        base64Content: string;
        appointmentId?: string;
    }) {
        return this.prisma.patientDocument.create({
            data: {
                patientId,
                label: data.label,
                fileType: data.fileType,
                base64Content: data.base64Content,
                appointmentId: data.appointmentId || null,
            }
        });
    }

    // Patient sees their own uploads
    async getMyDocuments(patientId: string) {
        return this.prisma.patientDocument.findMany({
            where: { patientId },
            select: {
                id: true,
                label: true,
                fileType: true,
                base64Content: true,
                appointmentId: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Doctor sees a specific patient's documents inside consultation room
    async getPatientDocuments(patientId: string) {
        return this.prisma.patientDocument.findMany({
            where: { patientId },
            select: {
                id: true,
                label: true,
                fileType: true,
                base64Content: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PatientDocumentsService } from './patient-documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient-documents')
@UseGuards(JwtAuthGuard)
export class PatientDocumentsController {
    constructor(private readonly service: PatientDocumentsService) {}

    // Patient uploads a document
    @Post('upload')
    async upload(@Request() req, @Body() body: {
        label: string;
        fileType: string;
        base64Content: string;
        appointmentId?: string;
    }) {
        return this.service.uploadDocument(req.user.id, body);
    }

    // Patient views their own documents
    @Get('my-documents')
    async myDocuments(@Request() req) {
        return this.service.getMyDocuments(req.user.id);
    }

    // Doctor views a patient's documents (inside consultation room)
    @Get('patient/:patientId')
    async patientDocuments(@Param('patientId') patientId: string, @Request() req) {
        if (req.user.role !== 'PRACTITIONER' && req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.service.getPatientDocuments(patientId);
    }
}

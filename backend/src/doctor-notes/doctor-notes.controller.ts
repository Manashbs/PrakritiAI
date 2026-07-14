import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DoctorNotesService } from './doctor-notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctor-notes')
@UseGuards(JwtAuthGuard)
export class DoctorNotesController {
    constructor(private readonly service: DoctorNotesService) {}

    // Doctor saves a note for a patient
    @Post()
    async saveNote(@Request() req, @Body() body: {
        patientId: string;
        content: string;
        isVisibleToPatient?: boolean;
    }) {
        if (req.user.role !== 'PRACTITIONER') throw new Error('Only practitioners can write notes');
        return this.service.saveNote(req.user.id, body);
    }

    // Doctor views all their notes for a specific patient (e.g., before a follow-up)
    @Get('patient/:patientId')
    async getForPatient(@Request() req, @Param('patientId') patientId: string) {
        if (req.user.role !== 'PRACTITIONER') throw new Error('Unauthorized');
        return this.service.getNotesForPatient(req.user.id, patientId);
    }

    // Patient reads notes left for them (only visible ones)
    @Get('my-notes')
    async myNotes(@Request() req) {
        return this.service.getPatientNotes(req.user.id);
    }
}

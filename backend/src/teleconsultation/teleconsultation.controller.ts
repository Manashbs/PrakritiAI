import { Controller, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { TeleconsultationService } from './teleconsultation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teleconsultation')
@UseGuards(JwtAuthGuard)
export class TeleconsultationController {
    constructor(private readonly teleconsultationService: TeleconsultationService) { }

    @Patch(':appointmentId/notes')
    async saveNotes(
        @Param('appointmentId') appointmentId: string,
        @Request() req,
        @Body('notes') notes: string
    ) {
        // Basic authorization checking is handled within the service method
        return this.teleconsultationService.saveSessionNotes(appointmentId, req.user.id, notes);
    }

    @Patch(':appointmentId/complete')
    async markComplete(
        @Param('appointmentId') appointmentId: string,
        @Request() req
    ) {
        return this.teleconsultationService.markConsultationComplete(appointmentId, req.user.id);
    }
}

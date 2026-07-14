import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post('book')
    async bookAppointment(@Request() req, @Body() body) {
        // Expected body: practitionerId, startTime, notes
        return this.appointmentsService.bookAppointment(req.user.id, body);
    }

    @Get('my-appointments')
    async getMyAppointments(@Request() req) {
        if (req.user.role === 'PRACTITIONER') {
            return this.appointmentsService.getPractitionerAppointments(req.user.id);
        } else {
            return this.appointmentsService.getPatientAppointments(req.user.id);
        }
    }

    @Patch(':id/complete')
    async completeAppointment(@Param('id') id: string, @Request() req) {
        return this.appointmentsService.completeAppointment(id, req.user.id);
    }

    // Doctor schedules a follow-up appointment for a specific patient
    @Post('book-for-patient')
    async bookForPatient(@Request() req, @Body() body: { patientId: string; startTime: string; notes?: string }) {
        if (req.user.role !== 'PRACTITIONER') throw new Error('Only practitioners can book for patients');
        return this.appointmentsService.bookForPatient(req.user.id, body);
    }
}

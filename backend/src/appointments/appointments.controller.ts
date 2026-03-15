import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
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
}

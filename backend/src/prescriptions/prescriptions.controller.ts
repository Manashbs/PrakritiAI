import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @Post()
    async createPrescription(@Request() req, @Body() body) {
        // Only practitioners can create prescriptions
        if (req.user.role !== 'PRACTITIONER') {
            throw new Error('Unauthorized role');
        }
        return this.prescriptionsService.createPrescription(req.user.id, body);
    }

    @Get('patient')
    async getPatientPrescriptions(@Request() req) {
        return this.prescriptionsService.getPatientPrescriptions(req.user.id);
    }

    @Get('practitioner')
    async getPractitionerPrescriptions(@Request() req) {
        if (req.user.role !== 'PRACTITIONER') throw new Error('Unauthorized');
        return this.prescriptionsService.getPractitionerPrescriptions(req.user.id);
    }
}

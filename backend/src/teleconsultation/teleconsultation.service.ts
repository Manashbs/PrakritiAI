import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeleconsultationService {
    constructor(private prisma: PrismaService) { }

    async saveSessionNotes(appointmentId: string, practitionerId: string, notes: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { practitioner: true },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');
        if (appointment.practitioner.userId !== practitionerId) {
            throw new NotFoundException('Unauthorized to add notes to this appointment');
        }

        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { notes },
        });
    }

    async markConsultationComplete(appointmentId: string, practitionerId: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { practitioner: true },
        });

        if (!appointment || appointment.practitioner.userId !== practitionerId) {
            throw new NotFoundException('Unauthorized to modify this appointment');
        }

        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
        });
    }
}

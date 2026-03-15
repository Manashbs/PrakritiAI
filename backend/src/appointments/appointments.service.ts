import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async bookAppointment(patientId: string, data: any) {
        // Check practitioner exists
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: data.practitionerId }
        });

        if (!practitioner) throw new NotFoundException('Practitioner not found');

        const startTime = new Date(data.startTime);
        const endTime = new Date(startTime.getTime() + 30 * 60000); // Default 30 min duration for MVP

        // Check for conflicting appointments
        const conflict = await this.prisma.appointment.findFirst({
            where: {
                practitionerId: practitioner.id,
                status: 'SCHEDULED',
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gt: startTime } }
                ]
            }
        });

        if (conflict) {
            throw new ConflictException('This time slot is already booked');
        }

        return this.prisma.appointment.create({
            data: {
                patientId,
                practitionerId: practitioner.id,
                startTime,
                endTime,
                notes: data.notes || '',
            }
        });
    }

    async getPatientAppointments(patientId: string) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                practitioner: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: { startTime: 'desc' },
        });
    }

    async getPractitionerAppointments(userId: string) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId }
        });

        if (!practitioner) throw new NotFoundException('Practitioner profile not found');

        return this.prisma.appointment.findMany({
            where: { practitionerId: practitioner.id },
            include: {
                patient: { select: { name: true, email: true } }
            },
            orderBy: { startTime: 'asc' },
        });
    }
}

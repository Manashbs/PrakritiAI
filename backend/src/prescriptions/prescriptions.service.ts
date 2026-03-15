import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrescriptionsService {
    constructor(private prisma: PrismaService) { }

    async createPrescription(practitionerUserId: string, data: any) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: practitionerUserId }
        });

        if (!practitioner) throw new NotFoundException('Practitioner profile not found');

        return this.prisma.prescription.create({
            data: {
                patientId: data.patientId,
                practitionerId: practitioner.id,
                lifestyle: data.lifestyle || '',
                medicines: {
                    create: data.medicines.map((m: any) => ({
                        name: m.name,
                        dosage: m.dosage,
                        frequency: m.frequency,
                        timing: m.timing,
                        duration: m.duration,
                    }))
                }
            },
            include: { medicines: true }
        });
    }

    async getPatientPrescriptions(patientId: string) {
        return this.prisma.prescription.findMany({
            where: { patientId },
            include: {
                practitioner: {
                    include: { user: { select: { name: true } } }
                },
                medicines: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPractitionerPrescriptions(practitionerUserId: string) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: practitionerUserId }
        });

        if (!practitioner) return [];

        return this.prisma.prescription.findMany({
            where: { practitionerId: practitioner.id },
            include: {
                patient: { select: { name: true, email: true } },
                medicines: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

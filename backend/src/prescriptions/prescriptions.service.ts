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

        // 1. Save the core Digital Prescription
        const prescription = await this.prisma.prescription.create({
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

        // 2. Map textual medicines to physical products
        const medicineNames = data.medicines.map((m: any) => m.name);
        const physicalProducts = await this.prisma.product.findMany({
            where: { name: { in: medicineNames } }
        });

        // 3. If matching products exist, bundle them into a Pending Order (Patient Cart)
        if (physicalProducts.length > 0) {
            const totalAmount = physicalProducts.reduce((sum, p) => sum + p.price, 0);
            
            await this.prisma.order.create({
                data: {
                    userId: data.patientId, // Attach cart to the patient
                    totalAmount,
                    status: 'PENDING',
                    items: {
                        create: physicalProducts.map(p => ({
                            productId: p.id,
                            quantity: 1, // Default to 1 unit prescribed
                            price: p.price
                        }))
                    }
                }
            });
        }

        return prescription;
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

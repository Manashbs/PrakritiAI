"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPrescription(practitionerUserId, data) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: practitionerUserId }
        });
        if (!practitioner)
            throw new common_1.NotFoundException('Practitioner profile not found');
        const prescription = await this.prisma.prescription.create({
            data: {
                patientId: data.patientId,
                practitionerId: practitioner.id,
                lifestyle: data.lifestyle || '',
                medicines: {
                    create: data.medicines.map((m) => ({
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
        const medicineNames = data.medicines.map((m) => m.name);
        const physicalProducts = await this.prisma.product.findMany({
            where: { name: { in: medicineNames } }
        });
        if (physicalProducts.length > 0) {
            const totalAmount = physicalProducts.reduce((sum, p) => sum + p.price, 0);
            await this.prisma.order.create({
                data: {
                    userId: data.patientId,
                    totalAmount,
                    status: 'PENDING',
                    items: {
                        create: physicalProducts.map(p => ({
                            productId: p.id,
                            quantity: 1,
                            price: p.price
                        }))
                    }
                }
            });
        }
        return prescription;
    }
    async getPatientPrescriptions(patientId) {
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
    async getPractitionerPrescriptions(practitionerUserId) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: practitionerUserId }
        });
        if (!practitioner)
            return [];
        return this.prisma.prescription.findMany({
            where: { practitionerId: practitioner.id },
            include: {
                patient: { select: { name: true, email: true } },
                medicines: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map
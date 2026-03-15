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
exports.TeleconsultationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TeleconsultationService = class TeleconsultationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveSessionNotes(appointmentId, practitionerId, notes) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { practitioner: true },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (appointment.practitioner.userId !== practitionerId) {
            throw new common_1.NotFoundException('Unauthorized to add notes to this appointment');
        }
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { notes },
        });
    }
    async markConsultationComplete(appointmentId, practitionerId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { practitioner: true },
        });
        if (!appointment || appointment.practitioner.userId !== practitionerId) {
            throw new common_1.NotFoundException('Unauthorized to modify this appointment');
        }
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
        });
    }
};
exports.TeleconsultationService = TeleconsultationService;
exports.TeleconsultationService = TeleconsultationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeleconsultationService);
//# sourceMappingURL=teleconsultation.service.js.map
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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bookAppointment(patientId, data) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { id: data.practitionerId }
        });
        if (!practitioner)
            throw new common_1.NotFoundException('Practitioner not found');
        const startTime = new Date(data.startTime);
        const endTime = new Date(startTime.getTime() + 30 * 60000);
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
            throw new common_1.ConflictException('This time slot is already booked');
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
    async getPatientAppointments(patientId) {
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
    async getPractitionerAppointments(userId) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId }
        });
        if (!practitioner)
            throw new common_1.NotFoundException('Practitioner profile not found');
        return this.prisma.appointment.findMany({
            where: { practitionerId: practitioner.id },
            include: {
                patient: { select: { name: true, email: true } }
            },
            orderBy: { startTime: 'asc' },
        });
    }
    async completeAppointment(appointmentId, requestingUserId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { practitioner: true }
        });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' }
        });
    }
    async bookForPatient(practitionerUserId, data) {
        const practitioner = await this.prisma.practitionerProfile.findUnique({
            where: { userId: practitionerUserId }
        });
        if (!practitioner)
            throw new common_1.NotFoundException('Practitioner profile not found');
        const startTime = new Date(data.startTime);
        const endTime = new Date(startTime.getTime() + 30 * 60000);
        return this.prisma.appointment.create({
            data: {
                patientId: data.patientId,
                practitionerId: practitioner.id,
                startTime,
                endTime,
                notes: data.notes || 'Follow-up consultation',
                status: 'SCHEDULED',
            }
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map
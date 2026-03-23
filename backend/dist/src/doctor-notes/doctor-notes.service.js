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
exports.DoctorNotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DoctorNotesService = class DoctorNotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPractitionerProfile(userId) {
        const p = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (!p)
            throw new common_1.NotFoundException('Practitioner profile not found');
        return p;
    }
    async saveNote(practitionerUserId, data) {
        const practitioner = await this.getPractitionerProfile(practitionerUserId);
        return this.prisma.doctorNote.create({
            data: {
                patientId: data.patientId,
                practitionerId: practitioner.id,
                content: data.content,
                isVisibleToPatient: data.isVisibleToPatient ?? true,
            }
        });
    }
    async getNotesForPatient(practitionerUserId, patientId) {
        const practitioner = await this.getPractitionerProfile(practitionerUserId);
        return this.prisma.doctorNote.findMany({
            where: {
                practitionerId: practitioner.id,
                patientId,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPatientNotes(patientId) {
        return this.prisma.doctorNote.findMany({
            where: {
                patientId,
                isVisibleToPatient: true,
            },
            include: {
                practitioner: {
                    include: { user: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.DoctorNotesService = DoctorNotesService;
exports.DoctorNotesService = DoctorNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorNotesService);
//# sourceMappingURL=doctor-notes.service.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentsController = void 0;
const common_1 = require("@nestjs/common");
const patient_documents_service_1 = require("./patient-documents.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PatientDocumentsController = class PatientDocumentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(req, body) {
        return this.service.uploadDocument(req.user.id, body);
    }
    async myDocuments(req) {
        return this.service.getMyDocuments(req.user.id);
    }
    async patientDocuments(patientId, req) {
        if (req.user.role !== 'PRACTITIONER' && req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.service.getPatientDocuments(patientId);
    }
};
exports.PatientDocumentsController = PatientDocumentsController;
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('my-documents'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "myDocuments", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "patientDocuments", null);
exports.PatientDocumentsController = PatientDocumentsController = __decorate([
    (0, common_1.Controller)('patient-documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [patient_documents_service_1.PatientDocumentsService])
], PatientDocumentsController);
//# sourceMappingURL=patient-documents.controller.js.map
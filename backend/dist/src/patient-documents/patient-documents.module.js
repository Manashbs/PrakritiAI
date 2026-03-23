"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const patient_documents_service_1 = require("./patient-documents.service");
const patient_documents_controller_1 = require("./patient-documents.controller");
const prisma_service_1 = require("../prisma.service");
let PatientDocumentsModule = class PatientDocumentsModule {
};
exports.PatientDocumentsModule = PatientDocumentsModule;
exports.PatientDocumentsModule = PatientDocumentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [patient_documents_controller_1.PatientDocumentsController],
        providers: [patient_documents_service_1.PatientDocumentsService, prisma_service_1.PrismaService],
    })
], PatientDocumentsModule);
//# sourceMappingURL=patient-documents.module.js.map
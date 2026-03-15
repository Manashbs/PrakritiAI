"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const vector_db_module_1 = require("./vector-db/vector-db.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const prisma_service_1 = require("./prisma.service");
const profiles_module_1 = require("./profiles/profiles.module");
const appointments_module_1 = require("./appointments/appointments.module");
const teleconsultation_module_1 = require("./teleconsultation/teleconsultation.module");
const ai_module_1 = require("./ai/ai.module");
const ecommerce_module_1 = require("./ecommerce/ecommerce.module");
const admin_module_1 = require("./admin/admin.module");
const prescriptions_module_1 = require("./prescriptions/prescriptions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [vector_db_module_1.VectorDbModule, auth_module_1.AuthModule, users_module_1.UsersModule, profiles_module_1.ProfilesModule, appointments_module_1.AppointmentsModule, teleconsultation_module_1.TeleconsultationModule, ai_module_1.AiModule, ecommerce_module_1.EcommerceModule, admin_module_1.AdminModule, prescriptions_module_1.PrescriptionsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
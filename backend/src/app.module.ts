import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorDbModule } from './vector-db/vector-db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ProfilesModule } from './profiles/profiles.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TeleconsultationModule } from './teleconsultation/teleconsultation.module';
import { AiModule } from './ai/ai.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { AdminModule } from './admin/admin.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [VectorDbModule, AuthModule, UsersModule, ProfilesModule, AppointmentsModule, TeleconsultationModule, AiModule, EcommerceModule, AdminModule, PrescriptionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }

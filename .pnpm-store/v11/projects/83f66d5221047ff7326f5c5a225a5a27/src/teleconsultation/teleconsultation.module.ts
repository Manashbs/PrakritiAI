import { Module } from '@nestjs/common';
import { TeleconsultationService } from './teleconsultation.service';
import { TeleconsultationController } from './teleconsultation.controller';
import { TeleconsultationGateway } from './teleconsultation.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TeleconsultationController],
  providers: [TeleconsultationService, TeleconsultationGateway, PrismaService],
})
export class TeleconsultationModule { }

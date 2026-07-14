import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsScheduler } from './appointments.scheduler';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsScheduler, PrismaService],
})
export class AppointmentsModule { }

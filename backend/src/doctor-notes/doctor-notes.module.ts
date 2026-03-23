import { Module } from '@nestjs/common';
import { DoctorNotesService } from './doctor-notes.service';
import { DoctorNotesController } from './doctor-notes.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DoctorNotesController],
  providers: [DoctorNotesService, PrismaService],
})
export class DoctorNotesModule {}

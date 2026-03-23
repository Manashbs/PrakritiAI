import { Module } from '@nestjs/common';
import { PatientDocumentsService } from './patient-documents.service';
import { PatientDocumentsController } from './patient-documents.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PatientDocumentsController],
  providers: [PatientDocumentsService, PrismaService],
})
export class PatientDocumentsModule {}

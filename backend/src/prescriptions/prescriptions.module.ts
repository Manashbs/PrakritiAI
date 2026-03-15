import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [PrescriptionsService, PrismaService],
    controllers: [PrescriptionsController]
})
export class PrescriptionsModule { }

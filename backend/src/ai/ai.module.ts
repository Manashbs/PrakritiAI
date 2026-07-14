import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { VectorDbService } from '../vector-db/vector-db.service';
import { ProfilesService } from '../profiles/profiles.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AiController],
  providers: [AiService, VectorDbService, ProfilesService, PrismaService],
})
export class AiModule { }

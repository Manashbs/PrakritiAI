import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly profilesService: ProfilesService
    ) { }

    @Post('triage')
    async generateTriage(@Request() req, @Body('symptoms') symptoms: string) {
        // Get basic patient profile
        const profile = await this.profilesService.getProfile(req.user.id);

        return this.aiService.getDiagnosticTriage(profile, symptoms);
    }
}

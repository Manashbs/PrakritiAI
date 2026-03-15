import { Controller, Get, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get('me')
    async getMyProfile(@Request() req) {
        return this.profilesService.getProfile(req.user.id);
    }

    @Get('practitioners')
    async getAllPractitioners() {
        return this.profilesService.getAllPractitioners();
    }

    @Patch('practitioner')
    async updatePractitionerProfile(@Request() req, @Body() body) {
        return this.profilesService.updatePractitionerProfile(req.user.id, body);
    }

    @Post('kyc/upload')
    async uploadKycDocument(@Request() req, @Body('photo') photo: string) {
        return this.profilesService.uploadKycDocument(req.user.id, photo);
    }
}

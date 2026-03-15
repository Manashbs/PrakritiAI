import { Controller, Post, Body, UnauthorizedException, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() req) {
        return this.authService.register(req);
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    @Post('forgot-password')
    async forgotPassword(@Body() req) {
        return this.authService.forgotPassword(req.email);
    }

    @Post('reset-password')
    async resetPassword(@Body() req) {
        return this.authService.resetPassword(req.token, req.newPassword);
    }
}

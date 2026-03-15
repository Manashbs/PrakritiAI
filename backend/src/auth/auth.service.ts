import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user: any = await this.usersService.user({ email });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            // Check Account Status
            if (user.status === 'SUSPENDED') {
                throw new UnauthorizedException('Your account has been suspended by an Administrator.');
            }

            // Practitioners now log in even if unverified so they can reach the /kyc portal.
            // The frontend will force-redirect them if kycVerified is false.

            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }

    async register(registrationData: any) {
        const { email, password, name, role } = registrationData;

        // Check if user exists
        const existingUser = await this.usersService.user({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Enforce Single Admin Rule
        if (role === 'ADMIN') {
            throw new UnauthorizedException('Cannot register as an ADMIN. Role restricted.');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const userCreateInput = {
            email,
            name,
            passwordHash,
            role: role || 'PATIENT' // Default role
        };

        const newUser = await this.usersService.createUser(userCreateInput);
        return this.login(newUser);
    }

    async forgotPassword(email: string) {
        if (!email) throw new UnauthorizedException('Email is required');

        const user = await this.usersService.user({ email });
        if (!user) {
            // For security, don't reveal if the user exists or not, just return success
            return { message: 'If that email exists, a reset link will be sent.' };
        }

        const token = uuidv4();
        // Set Expiration to 1 hour from now
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await this.prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        });

        // Setup Nodemailer (For now, just a dummy transporter to log the URL)
        // Note: For a real app, you would configure SMTP credentials here.
        const resetUrl = `https://prakriti-ai-ctnm.vercel.app/reset-password?token=${token}`;
        
        console.log(`\n\n=== PASSWORD RESET LINK GENERATED ===`);
        console.log(`To: ${email}`);
        console.log(`Link: ${resetUrl}`);
        console.log(`=====================================\n\n`);

        return { message: 'If that email exists, a reset link will be sent.' };
    }

    async resetPassword(token: string, newPassword: string) {
        if (!token || !newPassword) {
            throw new UnauthorizedException('Token and new password are required');
        }

        // Find user by token
        const user = await this.prisma.user.findFirst({
            where: { resetPasswordToken: token }
        });        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Password reset token is invalid or has expired');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update user and clear reset tokens
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        return { message: 'Password has been successfully reset' };
    }
}

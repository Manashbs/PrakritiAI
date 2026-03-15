import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
}

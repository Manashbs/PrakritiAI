import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'fallback_secret_for_dev_only',
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.user({ id: payload.sub });
        if (!user) {
            throw new UnauthorizedException();
        }
        // Return sanitized user object
        const { passwordHash, ...result } = user;
        return result;
    }
}

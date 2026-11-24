import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly usersService: UsersService;

  constructor(configService: ConfigService, usersService: UsersService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.usersService = usersService;
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findSafeById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('The account for this token no longer exists');
    }
    return user;
  }
}

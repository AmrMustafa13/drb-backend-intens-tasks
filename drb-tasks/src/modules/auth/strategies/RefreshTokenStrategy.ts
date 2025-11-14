import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies['refresh_token'];
          if (!token) {
            throw new UnauthorizedException('No refresh token found in cookie');
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('app.jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refresh_token'];
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken, // Include the token itself
    };
  }
}

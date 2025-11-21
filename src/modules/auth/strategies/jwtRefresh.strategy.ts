import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/users.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UserService,
    configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || '',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.body.refreshToken;
    const user = await this.userService.findByEmail(payload.email);
    if (!user || !user.refreshToken) {
      throw new BadRequestException(this.i18n.t('auth.invalidRefreshToken'));
    }

    const isMatch = refreshToken === user.refreshToken;
    if (!isMatch) {
      throw new BadRequestException(this.i18n.t('auth.invalidRefreshToken'));
    }

    return user;
  }
}

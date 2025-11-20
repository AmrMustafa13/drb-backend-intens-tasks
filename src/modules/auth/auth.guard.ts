import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';

import { TokenService } from '../token/token.service';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly i18n: I18nService,
    private readonly tokenService: TokenService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException(
        this.i18n.t('exceptions.INVALID_ACCESS', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }
    try {
      // Verify the access token
      const payload = await this.tokenService.verifyAccessToken(accessToken);

      const user = await this.userModel.findById(payload._id);

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.t('exceptions.NO_USER', {
            lang: I18nContext.current()?.lang,
          }),
        );
      }

      if (!user.refreshToken)
        throw new UnauthorizedException(
          'User is logged out. Please login again',
        );

      // Attach user to request
      request.user = user;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      if (err instanceof UnauthorizedException) throw err;

      throw new UnauthorizedException(
        this.i18n.t('exceptions.INVALID_REFRESH', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return true;
  }
}

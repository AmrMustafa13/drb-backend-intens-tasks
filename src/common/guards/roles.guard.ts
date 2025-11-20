import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { UserRole } from '../enums/user.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user)
      throw new ForbiddenException(
        this.i18n.t('exceptions.AUTH_REQ', {
          lang: I18nContext.current()?.lang,
        }),
      );

    if (!requiredRoles.includes(user.role))
      throw new ForbiddenException(
        this.i18n.t('exceptions.ROLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

    return requiredRoles.some((role) => user.role === role);
  }
}

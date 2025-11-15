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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
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
      throw new UnauthorizedException('Access token is missing or invalid');
    }
    try {
      // Verify the access token
      const payload = await this.tokenService.verifyAccessToken(accessToken);

      const user = await this.userModel
        .findById(payload._id)
        .select('-password')
        .lean();

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.refreshToken)
        throw new UnauthorizedException(
          'User is logged out. Please login again',
        );
      delete user.refreshToken;

      // Attach user to request
      request['user'] = {
        ...user,
        _id: user._id.toString(),
      };
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      if (err instanceof UnauthorizedException) throw err;

      throw new UnauthorizedException(
        'Access/Refresh token is invalid or expired',
      );
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
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
        .select('-password -refreshToken')
        .lean();

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired');
    }

    return true;
  }
}

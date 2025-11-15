import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/common/types/api.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken = async (payload: AccessTokenPayload) => {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    } as JwtSignOptions);
  };

  generateRefreshToken = async (id: string) => {
    return await this.jwtService.signAsync({ id }, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    } as JwtSignOptions);
  };

  verifyAccessToken = async (token: string) => {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      } as JwtVerifyOptions);
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired');
    }
  };

  verifyRefreshToken = async (token: string) => {
    try {
      return await this.jwtService.verifyAsync<{ id: string }>(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      } as JwtVerifyOptions);
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  };
}

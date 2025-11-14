import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

function parseDurationToSeconds(value: string): number {
  const result = ms(value as ms.StringValue);
  if (typeof result !== 'number') {
    throw new Error(`Invalid duration string: ${value}`);
  }
  return Math.floor(result / 1000);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getAccessTokenPayload(user: any): JwtPayload {
    return { sub: String(user._id), email: user.email, role: user.role };
  }

  private getAccessTokenOptions(): JwtSignOptions {
    const expiresInStr =
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '15m';
    return {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
      expiresIn: parseDurationToSeconds(expiresInStr),
    };
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    const expiresInStr =
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d';
    return {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')!,
      expiresIn: parseDurationToSeconds(expiresInStr),
    };
  }

  async register(dto: RegisterDto): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exist');

    const saltRounds =
      Number(this.configService.get<number>('SALT_ROUNDS')) || 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const created = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const payload: JwtPayload = this.getAccessTokenPayload(created);

    const accessToken = await this.jwtService.signAsync(
      payload,
      this.getAccessTokenOptions(),
    );
    const refreshTokenRaw = await this.jwtService.signAsync(
      { sub: String(created._id) },
      this.getRefreshTokenOptions(),
    );

    const hashedRefresh = await bcrypt.hash(refreshTokenRaw, saltRounds);
    await this.usersService.setRefreshToken(String(created._id), hashedRefresh);

    const userSafe = { ...(created.toObject ? created.toObject() : created) };
    delete (userSafe as any).password;

    return { user: userSafe, accessToken, refreshToken: refreshTokenRaw };
  }


  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = this.getAccessTokenPayload(user);

    const accessToken = await this.jwtService.signAsync(
      payload,
      this.getAccessTokenOptions(),
    );

    const refreshTokenRaw = await this.jwtService.signAsync(
      { sub: String(user._id) },
      this.getRefreshTokenOptions(),
    );

    const hashedRefresh = await bcrypt.hash(
      refreshTokenRaw,
      Number(this.configService.get<number>('SALT_ROUNDS')) || 10,
    );
    await this.usersService.setRefreshToken(String(user._id), hashedRefresh);

    return { accessToken, refreshToken: refreshTokenRaw };
  }


  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const userId = decoded.sub;
      const userRecord = await this.usersService.findByIdWithPassword(userId);

      if (!userRecord || !userRecord.refreshToken)
        throw new UnauthorizedException('Invalid refresh token');

      const matches = await bcrypt.compare(
        refreshToken,
        userRecord.refreshToken,
      );
      if (!matches) throw new UnauthorizedException('Invalid refresh token');

      const accessToken = await this.jwtService.signAsync(
        {
          sub: String(userRecord._id),
          email: userRecord.email,
          role: userRecord.role,
        },
        this.getAccessTokenOptions(),
      );

      const newRefreshTokenRaw = await this.jwtService.signAsync(
        { sub: String(userRecord._id) },
        this.getRefreshTokenOptions(),
      );

      const hashedNewRefresh = await bcrypt.hash(
        newRefreshTokenRaw,
        Number(this.configService.get<number>('SALT_ROUNDS')) || 10,
      );
      await this.usersService.setRefreshToken(
        String(userRecord._id),
        hashedNewRefresh,
      );

      return { accessToken, refreshToken: newRefreshTokenRaw };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }


  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new UnauthorizedException('Current password incorrect');

    const hashedNew = await bcrypt.hash(
      newPassword,
      Number(this.configService.get<number>('SALT_ROUNDS')) || 10,
    );

    await this.usersService.changePassword(userId, hashedNew);
    await this.usersService.removeRefreshToken(userId);

    return { message: 'Password changed successfully' };
  }
}

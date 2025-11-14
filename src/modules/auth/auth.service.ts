import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { compareHash, hashToken, hashVal } from 'src/utils/functions';
import { AccessTokenPayload, APIResponse } from 'src/common/types/api.type';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '../token/token.service';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private parseExpiresInMs(expiresIn: string) {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const units: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * units[unit];
  }

  sendCookie(res: Response, name: string, val: string) {
    const options: CookieOptions = {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('NODE_ENV') === 'production', // In production cookie will be sent only via HTTPs - encrypted
      maxAge: 7 * 24 * 60 * 60 * 100, // default max age of 7 days
    };

    if (name === 'refreshToken')
      options.maxAge = this.parseExpiresInMs(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN')!,
      );

    res.cookie(name, val, options);
  }

  async register(signupDto: SignupDto) {
    let user = await this.userModel.findOne({ email: signupDto.email });
    if (user) {
      throw new ConflictException('An account with this email already exists');
    }

    const { password, ...userData } = signupDto;

    const hashedPassword = await hashVal(password);

    user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    const payload: AccessTokenPayload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const res: APIResponse = {
      message: 'Account created successfully',
      data: { ...userData },
      accessToken,
    };

    return res;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException('Wrong email or password. Please try again');

    const correctPass = await compareHash(password, user.password);
    if (!correctPass)
      throw new NotFoundException('Wrong email or password. Please try again');

    const payload: AccessTokenPayload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(
      user._id.toString(),
    );

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashToken(refreshToken),
    });

    const res: APIResponse = {
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    };

    return res;
  }

  async logout() {}
}

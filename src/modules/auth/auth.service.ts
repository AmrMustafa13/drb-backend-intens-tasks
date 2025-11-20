import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';

import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { TokenService } from '../token/token.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compareHash, hashToken, hashVal } from 'src/utils/functions';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { AccessTokenPayload, APIResponse } from 'src/common/types/api.type';

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
    // check if user exists
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

    // create access token
    const payload: AccessTokenPayload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const result: APIResponse = {
      message: 'Account created successfully',
      data: user.cleanUser(),
      accessToken,
    };

    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // check if email matches no account
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException('Wrong email or password. Please try again');

    // compare password hashes
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

    // save refresh token in the database
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashToken(refreshToken),
    });

    const result: APIResponse = {
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    };

    return result;
  }

  getUserProfile(user: UserDocument) {
    // user already in the request
    const result: APIResponse = {
      data: user.cleanUser(),
    };

    return result;
  }

  async updateUserProfile(_id: string, updateProfileDto: UpdateProfileDto) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(_id, updateProfileDto, {
          new: true,
          runValidators: true, // run schema validators before save
        })
        .lean();

      const result: APIResponse = {
        message: 'Account updated successfully',
        data: updatedUser!.cleanUser,
      };
      return result;
    } catch (error) {
      // handle duplicate key error
      if (error instanceof MongoError && error.code === 11000)
        throw new ConflictException(
          'An account with this email already exists',
        );
      throw error;
    }
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    if (currentPassword === newPassword)
      throw new BadRequestException(
        'New password must be different from current password',
      );

    const user = (await this.userModel.findById(_id))!;

    const correctPass = await compareHash(currentPassword, user.password);
    if (!correctPass)
      throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await hashVal(newPassword);
    user.password = hashedPassword;
    user.refreshToken = undefined;

    await user.save();

    const result: APIResponse = {
      message: 'Password changed successfully',
    };

    return result;
  }

  async refresh(refreshToken: string) {
    const verifiedToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userModel
      .findById(verifiedToken.id)
      .select('_id email name');

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: AccessTokenPayload = {
      ...user,
      _id: user._id.toString(),
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const rotatedRefreshToken = await this.tokenService.generateRefreshToken(
      payload._id,
    );

    user.refreshToken = hashToken(rotatedRefreshToken);
    await user.save();

    const result: APIResponse = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  async logout(user: UserDocument) {
    user.refreshToken = undefined;
    await user.save();

    const result: APIResponse = {
      message: 'Logged out successfully',
    };
    return result;
  }
}

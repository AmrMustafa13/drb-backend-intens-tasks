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
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,
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
      throw new ConflictException(
        this.i18n.t('exceptions.EMAIL_EXISTS', {
          lang: I18nContext.current()?.lang,
        }),
      );
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
      message: this.i18n.t('messages.ACCOUNT_CREATED', {
        lang: I18nContext.current()?.lang,
      }),
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
      throw new NotFoundException(
        this.i18n.t('exceptions.WRONG_CRED', {
          lang: I18nContext.current()?.lang,
        }),
      );

    // compare password hashes
    const correctPass = await compareHash(password, user.password);
    if (!correctPass)
      throw new NotFoundException(
        this.i18n.t('exceptions.WRONG_CRED', {
          lang: I18nContext.current()?.lang,
        }),
      );

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
      message: this.i18n.t('messages.LOGGED_IN', {
        lang: I18nContext.current()?.lang,
      }),
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
        message: this.i18n.t('messages.ACCOUNT_UPDATED', {
          lang: I18nContext.current()?.lang,
        }),
        data: updatedUser!.cleanUser,
      };
      return result;
    } catch (error) {
      // handle duplicate key error
      if (error instanceof MongoError && error.code === 11000)
        throw new ConflictException(
          this.i18n.t('exceptions.EMAIL_EXISTS', {
            lang: I18nContext.current()?.lang,
          }),
        );
      throw error;
    }
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    if (currentPassword === newPassword)
      throw new BadRequestException(
        this.i18n.t('exceptions.DIFF_NEW_PASS', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const user = (await this.userModel.findById(_id))!;

    const correctPass = await compareHash(currentPassword, user.password);
    if (!correctPass)
      throw new UnauthorizedException(
        this.i18n.t('exceptions.INC_PASS', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const hashedPassword = await hashVal(newPassword);
    user.password = hashedPassword;
    user.refreshToken = undefined;

    await user.save();

    const result: APIResponse = {
      message: this.i18n.t('messages.PASSWORD_CHANGED', {
        lang: I18nContext.current()?.lang,
      }),
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
      throw new UnauthorizedException(
        this.i18n.t('exceptions.INVALID_REFRESH', {
          lang: I18nContext.current()?.lang,
        }),
      );
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
      message: this.i18n.t('messages.LOGGED_OUT', {
        lang: I18nContext.current()?.lang,
      }),
    };
    return result;
  }
}

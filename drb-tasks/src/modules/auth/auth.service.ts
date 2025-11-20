import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService, I18nContext } from 'nestjs-i18n';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly i18n: I18nService,
  ) {}

  private get lang(): string {
    return I18nContext.current()?.lang || 'en'; // default english
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('auth.INVALID_CREDENTIALS', { lang: this.lang }),
      );
    }

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18n.t('auth.INVALID_CREDENTIALS', { lang: this.lang }),
      );
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const payload = { sub: user._id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        this.i18n.t('ACCESS_DENIED', { lang: this.lang }),
      );
    }
    const isValid = await compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException(
        this.i18n.t('INVALID_REFRESH', { lang: this.lang }),
      );
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
    return { message: this.i18n.t('LOGOUT_SUCCESS', { lang: this.lang }) };
  }

  private async getTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwtSecret'),
      expiresIn: this.configService.get('app.jwtExpiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwtRefreshSecret'),
      expiresIn: this.configService.get('app.jwtRefreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await hash(refreshToken, 10);
    await this.userModel.updateOne({ _id: userId }, { refreshToken: hashed });
  }
}

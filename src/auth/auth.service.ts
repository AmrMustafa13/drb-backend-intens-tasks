import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: any;
    accessToken: string;
  }> {
    const user = await this.userService.create(registerDto);
    const accessToken = await this.generateAccessToken(user);

    const { password, ...safeUser } = user;
    return { user: safeUser, accessToken };
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.userService.setRefreshToken(user._id.toString(), refreshToken);

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async generateAccessToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: String(user._id), role: user.role };
    const secret = this.configService.get<string>('JWT_SECRET')!;
    
    const token = await this.jwtService.signAsync(
      payload,
      {
        secret: secret,
        expiresIn: '1h',
      }
    );

    return token;
  }

  private async generateRefreshToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET')!;
    
    return await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '30d',
    });
  }

  async refreshToken(user: any): Promise<{ accessToken: string }> {
    return { accessToken: await this.generateAccessToken(user) };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.removeRefreshToken(userId);
  }
}
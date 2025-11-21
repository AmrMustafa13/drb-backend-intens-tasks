import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Patch,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserService } from '../users/users.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { I18nService } from 'nestjs-i18n';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Req() req: any) {
    const user = await this.userService.findById(req.user.sub);
    if (!user) {
      throw new NotFoundException(this.i18n.t('user.not_found'));
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const user = await this.userService.update(req.user.sub, updateDto);
    if (!user) {
      throw new NotFoundException(this.i18n.t('user.not_found'));
    }
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Body() dto: RefreshDto, @Req() req: any) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    if (!req.user) throw new UnauthorizedException(this.i18n.t('user.notAuth'));
    await this.userService.changePassword(req.user.sub, dto);
    return { message: this.i18n.t('user.passChanged') };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.sub);
    return { message: this.i18n.t('user.loggedOut') };
  }
}

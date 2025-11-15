import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signupDto: SignupDto) {
    return await this.authService.register(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...result } = await this.authService.login(loginDto);
    this.authService.sendCookie(res, 'refreshToken', refreshToken!);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req['user'];

    const result = await this.authService.logout(user!._id.toString());

    res.clearCookie('refreshToken');
    return result;
  }

  @Get('profile')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard)
  getUserProfile(@Req() req: Request) {
    const { user } = req;
    return this.authService.getUserProfile(user!);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { user } = req;
    return await this.authService.updateUserProfile(
      user!._id,
      updateProfileDto,
    );
  }
}

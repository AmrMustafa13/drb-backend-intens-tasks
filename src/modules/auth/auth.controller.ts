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
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);

    const { refreshToken, ...response } = result;
    this.authService.sendCookie(res, 'refreshToken', refreshToken!);

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getCurrentUserProfile(@Req() req: Request) {
    return await this.authService.getCurrentUserProfile(req.user!);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateCurrentUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    return await this.authService.updateCurrentUser(
      req.user!._id as unknown as string,
      updateUserDto
    );
  }
}

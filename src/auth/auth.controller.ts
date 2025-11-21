import { Body, Controller, Post, UseGuards, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login and get access + refresh tokens' })
  @ApiResponse({ status: 201, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId || user.sub);
  }

  @ApiOperation({ summary: 'Update your profile data' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updates: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.userId || user.sub, updates);
  }

  @ApiOperation({ summary: 'Change your account password' })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Wrong current password' })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.userId || user.sub,
      body.currentPassword,
      body.newPassword,
    );
  }

  @ApiOperation({ summary: 'Generate new access + refresh tokens' })
  @ApiResponse({ status: 201, description: 'Tokens refreshed successfully' })
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Logged out successfully' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: any) {
    await this.authService.logout(user.userId || user.sub);
    return { message: 'Logged out successfully' };
  }
}

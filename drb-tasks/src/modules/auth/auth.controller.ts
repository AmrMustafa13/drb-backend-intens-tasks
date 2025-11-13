import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @CurrentUser() user,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    console.log('from updateProfile');
    console.log('user', user);
    console.log('updatedUser', updateUserProfileDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userService.updateUserProfile(user.id, updateUserProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(
    @CurrentUser() user,
    @Body() ChangePasswordDto: ChangePasswordDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userService.changePassword(user.id, ChangePasswordDto);
  }
}

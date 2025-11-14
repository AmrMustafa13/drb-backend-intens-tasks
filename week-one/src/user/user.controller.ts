import { Controller, Get, Patch, Request, Post , Body, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto';

@Controller('user')
export class UserController {
	constructor(private userServiec: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async profile(@Request() req) {
		return this.userServiec.getProfile();
	}
	@Patch('profile')
	async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
		return this.userServiec.updateProfile();
	}
}

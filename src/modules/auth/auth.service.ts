import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SignupDto } from './dto/signup.dto';
import { compareHash, hashVal } from 'src/utils/functions';
import { APIResponse } from 'src/common/types/api.type';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async signup(signupDto: SignupDto) {
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

    const res: APIResponse = {
      message: 'Account created successfully',
      data: userData,
    };

    return res;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException('Wrong email or password. Please try again');

    const correctPass = await compareHash(password, user.password);
    if (!correctPass)
      throw new NotFoundException('Wrong email or password. Please try again');

    const { password: _, ...userData } = user.toObject();
    const res: APIResponse = {
      message: 'Logged in successfully',
      data: userData,
    };

    return res;
  }
}

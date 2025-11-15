import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import bcrypt from 'node_modules/bcryptjs';
import { UpdateProfileDto } from 'src/auth/dto/updateProfile.dto';
import { ChangePasswordDto } from 'src/auth/dto/changePassword.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .lean();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password -refreshToken').lean();
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async create(registerData: RegisterDto): Promise<UserDocument> {
    const { email, password, name, phone, role } = registerData;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'user',
    });

    return (await user.save()).toObject();
  }

  async update(id: string, updatedData: UpdateProfileDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .select('-password -refreshToken')
      .lean();
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async changePassword(
    id: string,
    changePassDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException('User not found!');

    const isMatch = await bcrypt.compare(
      changePassDto.currentPassword,
      user.password,
    );
    if (!isMatch)
      throw new BadRequestException('Current password is incorrect!');

    user.password = await bcrypt.hash(changePassDto.newPassword, 10);
    await user.save();
  }

  async setRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken });
  }

  async removeRefreshToken(id: string): Promise<void> {
    await this.setRefreshToken(id, null);
  }
}

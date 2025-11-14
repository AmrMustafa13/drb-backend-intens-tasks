import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async update(userId: string, updateData: any): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
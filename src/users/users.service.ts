import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByIdWithPassword(id: string) {
    return this.userModel.findById(id).exec();
  }

  async create(createUserDto: CreateUserDto) {
    const created = new this.userModel(createUserDto);
    return created.save();
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async removeRefreshToken(userId: string) {
    await this.userModel
      .findByIdAndUpdate(userId, { $unset: { refreshToken: '' } })
      .exec();
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshToken) return false;
    return user.refreshToken === refreshToken;
  }

  async updateProfile(userId: string, updates: any) {
    return this.userModel
      .findByIdAndUpdate(userId, updates, { new: true, select: '-password' })
      .exec();
  }

  async changePassword(userId: string, newHashed: string) {
    return this.userModel
      .findByIdAndUpdate(userId, { password: newHashed })
      .exec();
  }
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password -refreshToken').exec();
  }
}

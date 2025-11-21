import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import bcrypt from 'bcrypt';
import { UpdateProfileDto } from '../auth/dto/updateProfile.dto';
import { ChangePasswordDto } from '../auth/dto/changePassword.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .lean();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password -refreshToken').lean();
    if (!user) throw new NotFoundException(this.i18n.t('user.not_found'));
    return user;
  }

  async create(registerData: RegisterDto): Promise<UserDocument> {
    const { email, password, name, phone, role } = registerData;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(this.i18n.t('user.already_exist'));
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
    if (!user) throw new NotFoundException(this.i18n.t('user.not_found'));
    return user;
  }

  async changePassword(
    id: string,
    changePassDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException(this.i18n.t('user.not_found'));

    const isMatch = await bcrypt.compare(
      changePassDto.currentPassword,
      user.password,
    );
    if (!isMatch)
      throw new BadRequestException(this.i18n.t('user.incorrect_pass'));

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

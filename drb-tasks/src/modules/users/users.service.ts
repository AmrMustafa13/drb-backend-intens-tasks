import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserProfileDto } from '../auth/dto/updateUserProfile.dto';
import { ChangePasswordDto } from '../auth/dto/changePassword.dto';
import { I18nService, I18nContext } from 'nestjs-i18n';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly i18n: I18nService,
  ) {}

  private get lang(): string {
    return I18nContext.current()?.lang || 'en'; // default english
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(
        this.i18n.t('user.EMAIL_EXISTS', { lang: this.lang }),
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await user.save();

    // const userObject = user.toObject();
    //error := The operand of a 'delete' operator must be optional
    // delete userObject.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userObject } = user.toObject(); // instead of delete
    return userObject;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('user.USER_NOT_FOUND', { lang: this.lang }),
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    // const user = await this.userModel
    //   .findById(userId)
    //   .select('-password')
    //   .exec();
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    // Object.assign(user, updateUserProfileDto);
    // await user.save();
    // return user.toObject();
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserProfileDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(
        this.i18n.t('user.USER_NOT_FOUND', { lang: this.lang }),
      );
    }

    return updatedUser;
  }

  async changePassword(userId: string, changePassword: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user)
      throw new NotFoundException(
        this.i18n.t('user.USER_NOT_FOUND', { lang: this.lang }),
      );
    const isMatch = await bcrypt.compare(
      changePassword.currentPassword,
      user.password,
    );
    if (!isMatch)
      throw new BadRequestException(
        this.i18n.t('user.CURRENT_PASSWORD_INCORRECT', { lang: this.lang }),
      );

    const hashed = await bcrypt.hash(changePassword.newPassword, 10);
    user.password = hashed;
    await user.save();

    return {
      message: this.i18n.t('user.PASSWORD_CHANGED', { lang: this.lang }),
    };
  }
}

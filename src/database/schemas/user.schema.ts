import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type UserMethods = {
  cleanUser(): object;
};

export type UserDocument = HydratedDocument<User, UserMethods>;

export enum UserRole {
  FLEET_MANAGER = 'fleetManager',
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.cleanUser = function () {
  const user = (this as UserDocument).toObject();
  const { password: _, refreshToken: __, ...cleanUser } = user;

  return cleanUser;
};

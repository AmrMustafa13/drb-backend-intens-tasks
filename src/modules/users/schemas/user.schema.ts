import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ require: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ require: true })
  password: string;

  @Prop({ require: true, trim: true })
  name: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  refreshToken?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

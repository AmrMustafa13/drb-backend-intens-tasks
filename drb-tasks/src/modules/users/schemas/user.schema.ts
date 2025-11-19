import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/modules/auth/enums/role.enum';

// export type UserDocument = User & Document;
@Schema({
  timestamps: true,
})
export class User {
  _id: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  phone?: string;
  // @Prop({ default: 'user' })
  @Prop({
    required: true,
    enum: Role, //(admin, manager, driver)
    default: Role.DRIVER,
    type: String,
  })
  role: string;
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

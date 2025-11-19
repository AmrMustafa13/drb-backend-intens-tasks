import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ unique: true, required: true })
  plateNumber: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  simNumber: string;

  @Prop()
  deviceId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  driverId: mongoose.Types.ObjectId;
}

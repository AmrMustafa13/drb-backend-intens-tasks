import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true, trim: true })
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
  simNumber?: string;

  @Prop()
  deviceId?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  driverId?: Types.ObjectId;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

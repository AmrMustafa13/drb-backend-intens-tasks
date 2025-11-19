import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type ObjectId } from 'mongoose';
import { Type } from '../enums/Type.enum';

@Schema()
export class Vehicle {
  @Prop({ required: true, unique: true, type: String })
  plateNumber: string;

  @Prop({ required: true, type: String })
  model: string;

  @Prop({ required: true, type: String })
  manufacturer: string;

  @Prop({
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
    type: Number,
  })
  year: number;

  @Prop({ required: true, enum: Type })
  type: Type;

  @Prop({ type: String })
  simNumber?: string;

  @Prop({ type: String })
  deviceId?: string;

  @Prop({ type: Types.ObjectId, ref: 'Driver' })
  driverId?: ObjectId;
}

export type VehicleDocument = Vehicle & Document;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

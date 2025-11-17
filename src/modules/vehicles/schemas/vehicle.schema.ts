import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { VehicleType } from '../vehicles.enums';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true, trim: true })
  plateNumber: string;

  @Prop({ trim: true, required: true })
  model: string;

  @Prop({ trim: true })
  manufacturer: string;

  @Prop()
  year: number;

  @Prop({ enum: VehicleType, required: true })
  type: VehicleType;

  @Prop({ trim: true })
  simNumber: string;

  @Prop({ trim: true })
  deviceId: string; // GPS device

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  driverId: MongooseSchema.Types.ObjectId;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

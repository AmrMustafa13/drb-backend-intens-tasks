import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { VehicleType } from 'src/common/enums/vehicle.enum';

export type VehicleDocument = HydratedDocument<Vehicle>;

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

  @Prop({ required: true, type: String, enum: VehicleType })
  type: VehicleType;

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

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

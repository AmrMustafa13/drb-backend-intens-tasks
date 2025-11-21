import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Vehicle {
  // _id automatically created
  @Prop({ unique: true })
  plateNumber: string;

  @Prop()
  model: string;

  @Prop()
  manufacturer: string;

  @Prop()
  year: number;

  @Prop()
  type: string; // car, bus, truck, van...

  @Prop()
  simNumber: string;

  @Prop()
  deviceId: string; // GPS device

  @Prop({ type: Types.ObjectId, ref: 'User' })
  driverId: Types.ObjectId; // reference to User
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

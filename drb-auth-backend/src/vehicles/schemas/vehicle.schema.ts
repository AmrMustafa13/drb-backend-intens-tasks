import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VehicleDocument = Vehicle & Document;

export enum VehicleType {
  CAR = 'car',
  VAN = 'van',
  BUS = 'bus',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
}

@Schema({ timestamps: true })
export class Vehicle {
  @ApiProperty({
    description: 'Vehicle plate number (unique identifier)',
    example: 'ABC-1234',
  })
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  plateNumber: string;

  @ApiProperty({
    description: 'Vehicle model',
    example: 'Camry',
  })
  @Prop({ required: true, trim: true })
  model: string;

  @ApiProperty({
    description: 'Vehicle manufacturer/brand',
    example: 'Toyota',
  })
  @Prop({ required: true, trim: true, index: true })
  manufacturer: string;

  @ApiProperty({
    description: 'Manufacturing year',
    example: 2023,
    minimum: 1900,
  })
  @Prop({
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  })
  year: number;

  @ApiProperty({
    description: 'Vehicle type',
    enum: VehicleType,
    example: VehicleType.CAR,
  })
  @Prop({
    required: true,
    enum: VehicleType,
    type: String,
    index: true,
  })
  type: VehicleType;

  @ApiProperty({
    description: 'SIM card number for GPS device',
    example: '+201234567890',
    required: false,
  })
  @Prop({ trim: true })
  simNumber?: string;

  @ApiProperty({
    description: 'Telematics device identifier',
    example: 'GPS-001',
    required: false,
  })
  @Prop({ trim: true })
  deviceId?: string;

  @ApiProperty({
    description: 'Assigned driver ID',
    type: String,
    required: false,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  driverId?: Types.ObjectId | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-11-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-11-15T10:00:00.000Z',
  })
  updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// Indexes for better query performance
VehicleSchema.index({ plateNumber: 1 });
VehicleSchema.index({ type: 1 });
VehicleSchema.index({ manufacturer: 1 });
VehicleSchema.index({ driverId: 1 });
VehicleSchema.index({ createdAt: -1 });

// Compound indexes for common queries
VehicleSchema.index({ type: 1, manufacturer: 1 });
VehicleSchema.index({ driverId: 1, type: 1 });

// Virtual for driver population
VehicleSchema.virtual('driver', {
  ref: 'User',
  localField: 'driverId',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtuals are included in JSON
VehicleSchema.set('toJSON', { virtuals: true });
VehicleSchema.set('toObject', { virtuals: true });

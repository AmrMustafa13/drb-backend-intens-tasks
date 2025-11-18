import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsMongoId,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  plateNumber: string; // unique validation handled in Mongoose schema

  @IsString()
  model: string;

  @IsString()
  manufacturer: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsIn(['car', 'van', 'bus', 'truck'])
  type: string;

  @IsOptional()
  @IsString()
  simNumber?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsMongoId({ message: 'driverId must be a valid MongoDB ObjectId' })
  driverId?: string;
}

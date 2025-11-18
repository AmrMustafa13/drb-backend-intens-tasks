import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsMongoId,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsIn(['car', 'van', 'bus', 'truck'])
  type?: string;

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

import { VehicleType } from 'src/common/enums/vehicle.enum';

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  year: number;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  type: VehicleType;

  @IsString()
  @IsOptional()
  simNumber?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsMongoId()
  @IsOptional()
  driverId?: string;
}

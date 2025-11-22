import { 
  IsString, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  Min, 
  Max,
  IsMongoId,
  Length
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleType } from '../schemas/vehicle.schema';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ 
    description: 'Vehicle model name',
    example: 'Corolla',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: 'validation.model.string' })
  @IsOptional()
  @Length(1, 50, { message: 'validation.model.length' })
  model?: string;

  @ApiPropertyOptional({ 
    description: 'Vehicle manufacturer/brand name',
    example: 'Honda',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: 'validation.manufacturer.string' })
  @IsOptional()
  @Length(1, 50, { message: 'validation.manufacturer.length' })
  manufacturer?: string;

  @ApiPropertyOptional({ 
    description: 'Manufacturing year (between 1900 and next year)',
    example: 2024,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'validation.year.number' })
  @IsOptional()
  @Min(1900, { message: 'validation.year.min' })
  @Max(new Date().getFullYear() + 1, { message: 'validation.year.max' })
  year?: number;

  @ApiPropertyOptional({ 
    description: 'Type of vehicle',
    enum: VehicleType,
    enumName: 'VehicleType',
    example: VehicleType.VAN,
    examples: ['car', 'van', 'bus', 'truck', 'motorcycle']
  })
  @IsEnum(VehicleType, { message: 'validation.type.enum' })
  @IsOptional()
  type?: VehicleType;

  @ApiPropertyOptional({ 
    description: 'SIM card number for GPS/telematics device',
    example: '+201987654321',
    maxLength: 20
  })
  @IsString({ message: 'validation.simNumber.string' })
  @IsOptional()
  @Length(0, 20, { message: 'validation.simNumber.length' })
  simNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Telematics/GPS device identifier',
    example: 'GPS-002',
    maxLength: 50
  })
  @IsString({ message: 'validation.deviceId.string' })
  @IsOptional()
  @Length(0, 50, { message: 'validation.deviceId.length' })
  deviceId?: string;

  @ApiPropertyOptional({ 
    description: 'MongoDB ObjectId of the driver to assign to this vehicle',
    example: '507f1f77bcf86cd799439011',
    type: String
  })
  @IsMongoId({ message: 'validation.driverId.invalid' })
  @IsOptional()
  driverId?: string;
}
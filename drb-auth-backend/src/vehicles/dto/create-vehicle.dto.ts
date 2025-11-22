import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  Min, 
  Max,
  IsMongoId,
  Matches,
  Length
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleType } from '../schemas/vehicle.schema';

export class CreateVehicleDto {
  @ApiProperty({ 
    description: 'Vehicle plate number (unique identifier). Will be converted to uppercase.',
    example: 'ABC-1234',
    minLength: 2,
    maxLength: 20
  })
  @IsString({ message: 'validation.plateNumber.string' })
  @IsNotEmpty({ message: 'validation.plateNumber.required' })
  @Length(2, 20, { message: 'validation.plateNumber.length' })
  @Matches(/^[A-Za-z0-9\-\s]+$/, { 
    message: 'validation.plateNumber.matches' 
  })
  plateNumber: string;

  @ApiProperty({ 
    description: 'Vehicle model name',
    example: 'Camry',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: 'validation.model.string' })
  @IsNotEmpty({ message: 'validation.model.required' })
  @Length(1, 50, { message: 'validation.model.length' })
  model: string;

  @ApiProperty({ 
    description: 'Vehicle manufacturer/brand name',
    example: 'Toyota',
    minLength: 1,
    maxLength: 50
  })
  @IsString({ message: 'validation.manufacturer.string' })
  @IsNotEmpty({ message: 'validation.manufacturer.required' })
  @Length(1, 50, { message: 'validation.manufacturer.length' })
  manufacturer: string;

  @ApiProperty({ 
    description: 'Manufacturing year (between 1900 and next year)',
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'validation.year.number' })
  @IsNotEmpty({ message: 'validation.year.required' })
  @Min(1900, { message: 'validation.year.min' })
  @Max(new Date().getFullYear() + 1, { message: 'validation.year.max' })
  year: number;

  @ApiProperty({ 
    description: 'Type of vehicle',
    enum: VehicleType,
    enumName: 'VehicleType',
    example: VehicleType.CAR,
    examples: ['car', 'van', 'bus', 'truck', 'motorcycle']
  })
  @IsEnum(VehicleType, { message: 'validation.type.enum' })
  @IsNotEmpty({ message: 'validation.type.required' })
  type: VehicleType;

  @ApiPropertyOptional({ 
    description: 'SIM card number for GPS/telematics device',
    example: '+201234567890',
    maxLength: 20
  })
  @IsString({ message: 'validation.simNumber.string' })
  @IsOptional()
  @Length(0, 20, { message: 'validation.simNumber.length' })
  simNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Telematics/GPS device identifier',
    example: 'GPS-001',
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
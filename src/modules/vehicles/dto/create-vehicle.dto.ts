import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from '../enums/Type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Unique plate number of the vehicle',
    example: 'ABC-1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({
    description: 'Model of the vehicle',
    example: 'Corolla',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Manufacturer of the vehicle',
    example: 'Toyota',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({
    description: 'Manufacturing year of the vehicle',
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear(),
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    description: 'Vehicle type from the allowed list',
    enum: Type,
    example: Type.CAR,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @ApiProperty({
    description: 'SIM number for the GPS device (optional)',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  simNumber?: string;

  @ApiProperty({
    description: 'Telematics or tracking device ID (optional)',
    example: 'DEV-55678',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({
    description: 'Driver ID assigned to this vehicle (optional)',
    example: '6731f209c34d21b7a8ed002a',
    required: false,
  })
  @IsOptional()
  @IsString()
  driverId?: string;
}

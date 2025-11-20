import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from '../enums/Type.enum';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    description: 'Model of the vehicle',
    example: 'Corolla',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer of the vehicle',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    description: 'Manufacturing year of the vehicle',
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear(),
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year?: number;

  @ApiPropertyOptional({
    description: 'Vehicle type from the allowed list',
    enum: Type,
    example: Type.CAR,
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'SIM number for the GPS device (optional)',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  simNumber?: string;

  @ApiPropertyOptional({
    description: 'Telematics or tracking device ID (optional)',
    example: 'DEV-55678',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'Driver ID assigned to this vehicle (optional)',
    example: '6731f209c34d21b7a8ed002a',
    required: false,
  })
  @IsOptional()
  @IsString()
  driverId?: string;
}

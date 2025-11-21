import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from '../enums/Type.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    description: 'Model of the vehicle',
    example: 'Corolla',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  model?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer of the vehicle',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  manufacturer?: string;

  @ApiPropertyOptional({
    description: 'Manufacturing year of the vehicle',
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear(),
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  @Min(1900, { message: i18nValidationMessage('validation.minYear') })
  @Max(new Date().getFullYear(), {
    message: i18nValidationMessage('validation.maxYear'),
  })
  year?: number;

  @ApiPropertyOptional({
    description: 'Vehicle type from the allowed list',
    enum: Type,
    example: Type.CAR,
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  type?: string;

  @ApiPropertyOptional({
    description: 'SIM number for the GPS device (optional)',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  simNumber?: string;

  @ApiPropertyOptional({
    description: 'Telematics or tracking device ID (optional)',
    example: 'DEV-55678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'Driver ID assigned to this vehicle (optional)',
    example: '6731f209c34d21b7a8ed002a',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  driverId?: string;
}

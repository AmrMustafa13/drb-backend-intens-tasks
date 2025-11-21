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
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Unique plate number of the vehicle',
    example: 'ABC-1234',
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  plateNumber: string;

  @ApiProperty({
    description: 'Model of the vehicle',
    example: 'Corolla',
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  model: string;

  @ApiProperty({
    description: 'Manufacturer of the vehicle',
    example: 'Toyota',
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  manufacturer: string;

  @ApiProperty({
    description: 'Manufacturing year of the vehicle',
    example: 2020,
    minimum: 1900,
    maximum: new Date().getFullYear(),
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  @Min(1900, { message: i18nValidationMessage('validation.minYear') })
  @Max(new Date().getFullYear(), { message: i18nValidationMessage('validation.maxYear') })
  year: number;

  @ApiProperty({
    description: 'Vehicle type from the allowed list',
    enum: Type,
    example: Type.CAR,
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsEnum(Type, { message: i18nValidationMessage('validation.isEnumType') })
  type: Type;

  @ApiProperty({
    description: 'SIM number for the GPS device (optional)',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  simNumber?: string;

  @ApiProperty({
    description: 'Telematics or tracking device ID (optional)',
    example: 'DEV-55678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  deviceId?: string;

  @ApiProperty({
    description: 'Driver ID assigned to this vehicle (optional)',
    example: '6731f209c34d21b7a8ed002a',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  driverId?: string;
}

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
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PLATE_NUMBER_REQUIRED'),
  })
  plateNumber: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('validation.MODEL_REQUIRED') })
  model: string;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.MANUFACTURER_REQUIRED'),
  })
  manufacturer: string;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.YEAR_REQUIRED') })
  @Min(1900)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  year: number;

  @IsEnum(VehicleType)
  @IsNotEmpty({ message: i18nValidationMessage('validation.TYPE_REQUIRED') })
  type: VehicleType;

  @IsString()
  @IsOptional()
  simNumber?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsMongoId({ message: i18nValidationMessage('validation.ID_INVALID') })
  @IsOptional()
  driverId?: string;
}

import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsMongoId,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateVehicleDto {
  @IsString({
    message: i18nValidationMessage('validation.PLATE_STRING'),
  })
  plateNumber: string;

  @IsString({
    message: i18nValidationMessage('validation.MODEL_STRING'),
  })
  model: string;

  @IsString({
    message: i18nValidationMessage('validation.MANUFACTURER_STRING'),
  })
  manufacturer: string;

  @IsNumber({}, { message: i18nValidationMessage('validation.YEAR_NUMBER') })
  year: number;

  @IsString()
  @IsIn(Object.values(VehicleType), {
    message: i18nValidationMessage('validation.TYPE_INVALID'),
  })
  type: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.SIM_STRING') })
  simNumber?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.DEVICE_STRING'),
  })
  deviceId?: string;

  @IsOptional()
  @IsMongoId({
    message: i18nValidationMessage('validation.DRIVER_ID_INVALID'),
  })
  driverId?: string;
}

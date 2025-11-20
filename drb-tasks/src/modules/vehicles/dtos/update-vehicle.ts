import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsMongoId,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.MODEL_STRING'),
  })
  model?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.MANUFACTURER_STRING'),
  })
  manufacturer?: string;

  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.YEAR_NUMBER') })
  year?: number;

  @IsOptional()
  @IsIn(['car', 'van', 'bus', 'truck'], {
    message: i18nValidationMessage('validation.TYPE_INVALID'),
  })
  type?: string;

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

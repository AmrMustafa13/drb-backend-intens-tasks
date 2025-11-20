import { IsMongoId, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AssignDriverDto {
  @IsMongoId({ message: i18nValidationMessage('validation.ID_INVALID') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.DRIVER_ID_REQUIRED'),
  })
  driverId: string;
}

import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.NAME_STRING') })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('EG', {
    message: i18nValidationMessage('validation.PHONE_INVALID'),
  })
  phone?: string;
}

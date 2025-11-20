import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.CURRENT_PASS_REQUIRED'),
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NEW_PASS_REQUIRED'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('validation.PASSWORD_MIN'),
  })
  newPassword: string;
}

import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_REQUIRED'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('validation.PASSWORD_MIN'),
  })
  password: string;
}

import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  IsPhoneNumber,
  IsIn,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Role } from 'src/modules/auth/enums/role.enum';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage('user.VALIDATION.NAME_STRING') })
  @IsNotEmpty({
    message: i18nValidationMessage('user.VALIDATION.NAME_REQUIRED'),
  })
  name: string;

  @IsEmail(
    {},
    { message: i18nValidationMessage('auth.VALIDATION.EMAIL_INVALID') },
  )
  email: string;

  @IsString()
  @MinLength(8, {
    message: i18nValidationMessage('validation.PASSWORD_MIN'),
  })
  password: string;

  @IsOptional()
  @IsPhoneNumber('EG', {
    message: i18nValidationMessage('validation.PHONE_INVALID'),
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.ROLE_STRING') })
  @IsIn(Object.values(Role), {
    message: i18nValidationMessage('validation.ROLE_INVALID'),
  })
  role?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty({
    description: "The user's email address",
    example: 'user@example.com',
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.EMAIL_REQUIRED') })
  email!: string;

  @ApiProperty({
    description: "The user's password",
    example: 'Password123!',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_REQUIRED'),
  })
  password!: string;
}

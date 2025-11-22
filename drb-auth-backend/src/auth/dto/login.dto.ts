// ==================== src/auth/dto/login.dto.ts ====================
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.email.invalid') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.email.required') })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString({ message: i18nValidationMessage('validation.password.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.password.required') })
  password: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignupDto {
  @ApiProperty({
    description: "The user's email address",
    example: 'user@example.com',
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.EMAIL_REQUIRED') })
  email!: string;

  @ApiProperty({
    description:
      "The user's password (must contain uppercase, lowercase, number and special character)",
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsStrongPassword(
    {},
    {
      message: i18nValidationMessage('validation.PASSWORD_STRONG'),
    },
  )
  @MinLength(8, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_LENGTH'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_REQUIRED'),
  })
  password!: string;

  @ApiProperty({
    description: "The user's full name",
    example: 'John Doe',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NAME_REQUIRED') })
  @MinLength(1, { message: i18nValidationMessage('validation.NAME_EMPTY') })
  @MaxLength(50, {
    message: i18nValidationMessage('validation.NAME_MAX_LENGTH'),
  })
  name!: string;

  @ApiPropertyOptional({
    description: "The user's phone number",
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage('validation.PHONE_INVALID'),
  })
  phone?: string;

  @ApiPropertyOptional({
    description: "The user's role",
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: i18nValidationMessage('validation.ROLE_INVALID'),
  })
  @IsNotIn([UserRole.ADMIN], {
    message: i18nValidationMessage('validation.ROLE_ADMIN'),
  })
  role?: UserRole = UserRole.USER;
}

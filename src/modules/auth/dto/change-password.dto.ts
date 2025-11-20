import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @ApiProperty({
    description: "The user's current password",
    example: 'OldPassword123!',
  })
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.CURRENT_PASSWORD_REQUIRED'),
  })
  currentPassword!: string;

  @ApiProperty({
    description:
      'The new password (must contain uppercase, lowercase, number and special character)',
    example: 'NewPassword123!',
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
  newPassword!: string;
}

import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString({ message: i18nValidationMessage('validation.currentPassword.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.currentPassword.required') })
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString({ message: i18nValidationMessage('validation.newPassword.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.newPassword.required') })
  @MinLength(8, { message: i18nValidationMessage('validation.newPassword.minLength') })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: i18nValidationMessage('validation.newPassword.matches'),
  })
  newPassword: string;
}
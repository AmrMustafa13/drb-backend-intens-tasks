import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsEnum,
  IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/roles.enum';
import { i18nValidationMessage } from 'nestjs-i18n';


export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.email.invalid') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.email.required') })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString({ message: i18nValidationMessage('validation.password.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.password.required') })
  @MinLength(8, { message: i18nValidationMessage('validation.password.minLength') })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: i18nValidationMessage('validation.password.matches'),
  })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: i18nValidationMessage('validation.name.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.name.required') })
  @MinLength(2, { message: i18nValidationMessage('validation.name.minLength') })
  name: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.phone.string') })
  phone?: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: [UserRole.USER, UserRole.FLEET_MANAGER],
    required: false,
  })
  @IsOptional()
  @IsEnum([UserRole.USER, UserRole.FLEET_MANAGER], {
    message: i18nValidationMessage('validation.role.enum'),
  })
  role?: UserRole;
}

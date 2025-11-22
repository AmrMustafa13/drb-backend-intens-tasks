// ==================== src/auth/dto/update-profile.dto.ts ====================
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';


export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John Updated' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.name.string') })
  @MinLength(2, { message: i18nValidationMessage('validation.name.minLength') })
  name?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.phone.string') })
  phone?: string;
}
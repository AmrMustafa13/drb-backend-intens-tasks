// ==================== src/auth/dto/refresh-token.dto.ts ====================
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.refreshToken.string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.refreshToken.required') })
  refreshToken: string;
}

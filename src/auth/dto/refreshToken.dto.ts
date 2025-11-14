import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token issued by /auth/login or /auth/register',
  })
  @IsString()
  refreshToken: string;
}

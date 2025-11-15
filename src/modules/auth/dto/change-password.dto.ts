import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: "The user's current password",
    example: 'OldPassword123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current Passeord is required' })
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
      message:
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  newPassword!: string;
}

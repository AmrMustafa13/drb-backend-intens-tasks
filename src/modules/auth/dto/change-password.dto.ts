import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current Passeord is required' })
  currentPassword!: string;

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

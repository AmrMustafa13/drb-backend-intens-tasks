import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../database/schemas/user.schema';

export class SignupDto {
  @ApiProperty({
    description: "The user's email address",
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
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
      message:
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @ApiProperty({
    description: "The user's full name",
    example: 'John Doe',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name!: string;

  @ApiPropertyOptional({
    description: "The user's phone number",
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiPropertyOptional({
    description: "The user's role",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either customer or driver' })
  role?: UserRole = UserRole.CUSTOMER;
}

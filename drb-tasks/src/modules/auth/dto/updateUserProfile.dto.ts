import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';
export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;
}

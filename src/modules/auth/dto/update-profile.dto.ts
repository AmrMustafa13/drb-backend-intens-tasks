import { OmitType, PartialType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class UpdateProfileDto extends PartialType(
  OmitType(SignupDto, ['password'] as const),
) {}

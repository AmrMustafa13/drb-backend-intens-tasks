import { PartialType, PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UpdateUserDto extends PartialType(
  PickType(RegisterDto, ['name', 'email', 'phoneNumber'])
) {}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AssignDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId: string;
}

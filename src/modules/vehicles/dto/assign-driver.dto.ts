import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignDriverDto {
  @ApiProperty({ example: '6917263c2c30a870cd527dd2' })
  @IsNotEmpty()
  @IsString()
  driverId: string;
}

import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDriverDto {
	@ApiProperty({ description: 'Driver ID to assign to the vehicle' })
	@IsNotEmpty()
	@IsMongoId()
	driverId: string;
}

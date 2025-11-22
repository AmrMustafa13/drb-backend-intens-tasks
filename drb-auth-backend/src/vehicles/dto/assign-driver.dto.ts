import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDriverDto {
  @ApiProperty({ 
    description: 'MongoDB ObjectId of the driver to assign to this vehicle. The driver must exist in the database and must not be assigned to any other vehicle.',
    example: '507f1f77bcf86cd799439011',
    type: String,
    required: true
  })
  @IsMongoId({ message: 'validation.driverId.invalid' })
  @IsNotEmpty({ message: 'validation.driverId.required' })
  driverId: string;
}
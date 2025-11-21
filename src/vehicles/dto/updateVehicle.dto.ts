import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './createVehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';

export class updateVehicleDto extends PartialType(
  OmitType(CreateVehicleDto, ['plateNumber'] as const),
) {}

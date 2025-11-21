import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateVehicleDto } from "./CreateVehicleDto.dto";

export class UpdateVehicleDto extends PartialType(
	OmitType(CreateVehicleDto, ['plateNumber']),
) {}

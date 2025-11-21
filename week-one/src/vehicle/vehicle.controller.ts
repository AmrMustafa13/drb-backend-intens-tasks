import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { AssignDriverDto, CreateVehicleDto, VehicleQueryDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateVehicleDto } from './dto/UpdateVehicleDto.dto';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
	constructor(private vehicleService: VehicleService) {}

	@Roles(Role.ADMIN, Role.FLEET_MANAGER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new vehicle',
		description:
			'Create a new Vehicle. Only Admin and Fleet Manager can use this endpoint',
	})
	@Post('/')
	async CreateVehicle(@Body() dto: CreateVehicleDto) {
		return await this.vehicleService.CreateVehicle(dto);
	}

	@ApiOperation({
		summary: 'Get all vehicles',
		description:
			'Get all vehicles with pagination, filtering, and sorting options',
	})
	@Get()
	async GetAllVehicle(@Query() query: VehicleQueryDto) {
		return this.vehicleService.GetAllVehicles(query);
	}

	@ApiOperation({ summary: 'Get vehicle by ID' })
	@Get(':id')
	async GetVehicleById(@Param('id') id: string) {
		return this.vehicleService.GetVehicleById(id);
	}

	@Roles(Role.ADMIN, Role.FLEET_MANAGER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update vehicle',
		description:
			'Update vehicle details. Only Admin and Fleet Manager can use this endpoint',
	})
	@Patch(':id')
	async UpdateVehicle(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
		return this.vehicleService.updateVehicle(id, dto);
	}

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete vehicle',
		description: 'Delete a vehicle. Only Admin can use this endpoint',
	})
	@Delete(':id')
	async DeleteVehicle(@Param('id') id: string) {
		return this.vehicleService.deleteVehicle(id);
	}

	@Roles(Role.ADMIN, Role.FLEET_MANAGER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Assign driver to vehicle',
		description:
			'Assign a driver to a vehicle. Only Admin and Fleet Manager can use this endpoint',
	})
	@HttpCode(HttpStatus.OK)
	@Patch(':id/assign-driver')
	async AssignDriver(
		@Param('id') id: string,
		@Body() dto: AssignDriverDto,
	) {
		return this.vehicleService.assignDriver(id, dto.driverId);
	}

	@Roles(Role.ADMIN, Role.FLEET_MANAGER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Unassign driver from vehicle',
		description:
			'Remove driver assignment from a vehicle. Only Admin and Fleet Manager can use this endpoint',
	})
	@HttpCode(HttpStatus.OK)
	@Patch(':id/unassign-driver')
	async UnassignDriver(@Param('id') id: string) {
		return this.vehicleService.unassignDriver(id);
	}
}

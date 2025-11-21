import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { AssignDriverDto } from './dto/assignDriver.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @Roles('admin', 'fleet_manager')
  async create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Get()
  async findAll(@Query() query) {
    const { limit = 10, page = 1, type, manufacturer } = query;
    const filter: any = {};
    if (type) filter.type = type;
    if (manufacturer) filter.manufacturer = manufacturer;
    return this.vehiclesService.findAll(filter, +limit, +page);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Patch(':id')
  @Roles('admin', 'fleet_manager')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }

  @Patch(':id/assign-driver')
  @Roles('admin', 'fleet_manager')
  async assignDriver(@Param('id') id: string, @Body() dto: AssignDriverDto) {
    return this.vehiclesService.assignDriver(id, dto.driverId);
  }

  @Patch(':id/unassign-driver')
  @Roles('admin', 'fleet_manager')
  async unassignDriver(@Param('id') id: string) {
    return this.vehiclesService.unassignDriver(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetVehiclesQueryDto } from './dto/get-vehicles.query.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'fleet_manager')
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetVehiclesQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign-driver')
  assignDriver(
    @Param('id') vehicleId: string,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    return this.vehiclesService.assignDriver(vehicleId, assignDriverDto.driverId);
  }
}

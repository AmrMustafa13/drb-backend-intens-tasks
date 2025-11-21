import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';
import { VehiclesQueryDto } from './dtos/vehicle-query.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle';
import { AssignDriverDto } from './dtos/assign-driver.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth() // to send token from Swagger UI
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }
  @Get()
  getAllVehicles(@Query() vehicleQueryDto: VehiclesQueryDto) {
    return this.vehicleService.getAllVehicles(vehicleQueryDto);
  }

  @Get(':id')
  getVehicleById(@Param('id') vehicleId: string) {
    return this.vehicleService.getVehicleByID(vehicleId);
  }

  @Patch(':id')
  updateVehicle(
    @Param('id') vehicleId: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(vehicleId, updateVehicleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteVehicle(@Param('id') vehicleId: string) {
    return this.vehicleService.deleteVehicle(vehicleId);
  }

  @Patch(':id/assign-driver')
  assignDriver(
    @Param('id') vehicleId: string,
    @Body() assignDriver: AssignDriverDto,
  ) {
    return this.vehicleService.assignDriver(vehicleId, assignDriver);
  }

  @Patch(':id/unassign-driver')
  unassignDriver(@Param('id') vehicleId: string) {
    return this.vehicleService.unAssignDriver(vehicleId);
  }
}

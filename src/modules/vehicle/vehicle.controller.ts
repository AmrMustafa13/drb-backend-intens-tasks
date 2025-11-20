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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { VehicleService } from './vehicle.service';
import { UserRole } from 'src/common/enums/user.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdDto } from 'src/common/dtos/id.dto';
import { updateVehicleDto } from './dto/update-vehicle.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vehicle created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Vehicle with this plate number already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Admin or Fleet Manager only',
  })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of all vehicles',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the vehicle details',
  })
  findOne(@Param() params: IdDto) {
    const { id } = params;
    return this.vehicleService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ type: updateVehicleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found',
  })
  updateOne(
    @Param() params: IdDto,
    @Body() updateVehicleDto: updateVehicleDto,
  ) {
    const { id } = params;
    return this.vehicleService.updateOne(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Vehicle deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Admin only',
  })
  deleteOne(@Param() params: IdDto) {
    const { id } = params;
    return this.vehicleService.deleteOne(id);
  }

  @Patch(':id/assign-driver')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Assign a driver to a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ type: AssignDriverDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver assigned to vehicle successfully',
  })
  assignDriver(
    @Param() params: IdDto,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    const { id } = params;
    const { driverId } = assignDriverDto;
    return this.vehicleService.assignDriver(id, driverId);
  }

  @Patch(':id/unassign-driver')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Unassign a driver from a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver unassigned from vehicle successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found',
  })
  unAssignDriver(@Param() params: IdDto) {
    const { id } = params;
    return this.vehicleService.unAssignDriver(id);
  }
}

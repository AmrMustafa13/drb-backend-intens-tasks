import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicles.dto';
import { VehiclesService } from './vehicles.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../users/user.enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { QueryString } from 'src/common/types/api.types';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post('/')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FM)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new vehicle',
    description:
      'Create a new vehicle in the system. **Requires authentication and ADMIN or FLEET_MANAGER role.**',
  })
  @ApiBody({ type: CreateVehicleDto })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return await this.vehiclesService.create(createVehicleDto);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all vehicles',
    description:
      'Retrieve a list of all vehicles with optional filtering, sorting, pagination, and field selection. **Requires authentication.**',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort by field (prefix with - for descending)',
    example: '-year,manufacturer',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Comma-separated list of fields to include',
    example: 'plateNumber,model,manufacturer,year',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['assigned', 'unassigned'],
    description: 'Filter by assignment status',
    example: 'assigned',
  })
  async find(@Query() q: QueryString) {
    return await this.vehiclesService.find(q);
  }
}

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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ 
    summary: 'Create a new vehicle',
    description: 'Creates a new vehicle in the fleet management system. Only accessible by admin and fleet_manager roles. Plate numbers must be unique and will be automatically converted to uppercase.'
  })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Vehicle created successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        plateNumber: 'ABC-1234',
        model: 'Camry',
        manufacturer: 'Toyota',
        year: 2023,
        type: 'car',
        simNumber: '+201234567890',
        deviceId: 'GPS-001',
        driverId: {
          _id: '507f1f77bcf86cd799439012',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+201111111111'
        },
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Conflict - plate number already exists' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all vehicles',
    description: 'Retrieves a paginated list of all vehicles with optional filtering and sorting. Accessible by all authenticated users.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicles retrieved successfully',
    schema: {
      example: {
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            plateNumber: 'ABC-1234',
            model: 'Camry',
            manufacturer: 'Toyota',
            year: 2023,
            type: 'car',
            driverId: {
              name: 'John Doe',
              email: 'john@example.com'
            }
          }
        ],
        pagination: {
          total: 45,
          page: 1,
          limit: 10,
          totalPages: 5,
          hasNextPage: true,
          hasPreviousPage: false
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  findAll(@Query() query: VehicleQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get vehicle by ID',
    description: 'Retrieves detailed information about a specific vehicle including populated driver information. Accessible by all authenticated users.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the vehicle',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle found',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        plateNumber: 'ABC-1234',
        model: 'Camry',
        manufacturer: 'Toyota',
        year: 2023,
        type: 'car',
        simNumber: '+201234567890',
        deviceId: 'GPS-001',
        driverId: {
          _id: '507f1f77bcf86cd799439012',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+201111111111',
          role: 'driver'
        },
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid vehicle ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Patch(':id')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ 
    summary: 'Update vehicle',
    description: 'Updates vehicle information. Only accessible by admin and fleet_manager roles. All fields are optional.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the vehicle',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle updated successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        plateNumber: 'ABC-1234',
        model: 'Corolla',
        manufacturer: 'Toyota',
        year: 2024,
        type: 'car',
        simNumber: '+201234567890',
        deviceId: 'GPS-002',
        driverId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T11:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or invalid ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete vehicle',
    description: 'Permanently deletes a vehicle from the system. Only accessible by admin role. This action cannot be undone.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the vehicle to delete',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Vehicle deleted successfully',
    schema: {
      example: {
        message: 'Vehicle deleted successfully',
        deletedVehicle: {
          id: '507f1f77bcf86cd799439011',
          plateNumber: 'ABC-1234'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }

  @Patch(':id/assign-driver')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ 
    summary: 'Assign driver to vehicle',
    description: 'Assigns a driver to a specific vehicle. Only accessible by admin and fleet_manager roles. The driver must exist and cannot be assigned to multiple vehicles simultaneously.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the vehicle',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: AssignDriverDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Driver assigned successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        plateNumber: 'ABC-1234',
        model: 'Camry',
        manufacturer: 'Toyota',
        year: 2023,
        type: 'car',
        driverId: {
          _id: '507f1f77bcf86cd799439012',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+201111111111',
          role: 'driver'
        },
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid driver ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Vehicle or driver not found' })
  @ApiResponse({ status: 409, description: 'Conflict - driver already assigned to another vehicle' })
  assignDriver(
    @Param('id') id: string,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    return this.vehiclesService.assignDriver(id, assignDriverDto);
  }

  @Patch(':id/unassign-driver')
  @Roles('admin', 'fleet_manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Unassign driver from vehicle',
    description: 'Removes the driver assignment from a vehicle. Only accessible by admin and fleet_manager roles. The vehicle must have a driver assigned.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the vehicle',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Driver unassigned successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        plateNumber: 'ABC-1234',
        model: 'Camry',
        manufacturer: 'Toyota',
        year: 2023,
        type: 'car',
        driverId: null,
        createdAt: '2025-11-15T10:00:00.000Z',
        updatedAt: '2025-11-15T13:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - no driver assigned to this vehicle' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  unassignDriver(@Param('id') id: string) {
    return this.vehiclesService.unassignDriver(id);
  }
}
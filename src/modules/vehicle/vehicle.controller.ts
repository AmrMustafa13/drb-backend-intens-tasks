import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { VehicleService } from './vehicle.service';
import { UserRole } from 'src/common/enums/user.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)
  @Post('')
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('')
  findAll() {
    return this.vehicleService.findAll();
  }
}

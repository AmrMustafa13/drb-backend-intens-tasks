import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { VehicleService } from './vehicle.service';
import { UserRole } from 'src/common/enums/user.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdDto } from 'src/common/dtos/id.dto';
import { updateVehicleDto } from './dto/update-vehicle.dto';

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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param() params: IdDto) {
    const { id } = params;
    return this.vehicleService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOne(
    @Param() params: IdDto,
    @Body() updateVehicleDto: updateVehicleDto,
  ) {
    const { id } = params;
    return this.vehicleService.updateOne(id, updateVehicleDto);
  }
}

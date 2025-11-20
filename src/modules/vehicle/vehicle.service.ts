import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle, VehicleDocument } from 'src/database/schemas/vehicle.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APIResponse } from 'src/common/types/api.type';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { UserRole } from 'src/common/enums/user.enum';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    if (createVehicleDto.driverId) {
      const driver = await this.userModel.findById(createVehicleDto.driverId);

      if (!driver) {
        throw new NotFoundException(`No driver found with this id`);
      }

      if (driver.role !== UserRole.DRIVER) {
        throw new BadRequestException(`User with provided id is not a driver`);
      }
    }

    const vehicle = await this.vehicleModel.create(createVehicleDto);

    const res: APIResponse = {
      message: 'vehicle created successfully',
      data: vehicle,
    };
    return res;
  }
  catch(error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const value = error.keyValue?.[field];
      throw new ConflictException(
        `Vehicle with ${field} '${value}' already exists`,
      );
    }
    throw new InternalServerErrorException('Failed to create vehicle');
  }

  async findAll() {
    const vehicles = await this.vehicleModel.find();

    const res: APIResponse = {
      size: vehicles.length,
      data: vehicles,
    };
    return res;
  }
}

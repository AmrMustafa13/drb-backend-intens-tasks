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
import { updateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      if (createVehicleDto.driverId) {
        const driver = await this.userModel.findById(createVehicleDto.driverId);

        if (!driver) {
          throw new NotFoundException(`No driver found with this id`);
        }

        if (driver.role !== UserRole.DRIVER) {
          throw new BadRequestException(
            `User with provided id is not a driver`,
          );
        }
      }

      const vehicle = await this.vehicleModel.create(createVehicleDto);

      const res: APIResponse = {
        message: 'vehicle created successfully',
        data: vehicle,
      };
      return res;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        const value = error.keyValue?.[field];
        throw new ConflictException(
          `Vehicle with ${field} '${value}' already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to create vehicle');
    }
  }

  async findAll() {
    const vehicles = await this.vehicleModel.find();

    const res: APIResponse = {
      size: vehicles.length,
      data: vehicles,
    };
    return res;
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleModel
      .findById(id)
      .populate('driverId', '-password -refreshToken -__v');

    if (!vehicle) throw new NotFoundException('No vehicle found with this id');

    const res: APIResponse = {
      data: vehicle,
    };
    return res;
  }

  async updateOne(id: string, updateVehicleDto: updateVehicleDto) {
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .populate('driverId', '-password -refreshToken -__v');

    if (!updatedVehicle)
      throw new NotFoundException('No vehicle found with this is');

    const res: APIResponse = {
      data: updatedVehicle,
    };
    return res;
  }

  async deleteOne(id: string) {
    const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id);
    if (!deletedVehicle)
      throw new NotFoundException('No vehicle found with this id');

    const res: APIResponse = {
      message: 'Vehicle deleted successfully',
    };
    return res;
  }

  async assignDriver(id: string, driverId: string) {
    // check if user exists, and is a driver
    const driver = await this.userModel.findById(driverId);

    if (!driver) throw new NotFoundException('No driver found with this id.');
    if (driver.role !== UserRole.DRIVER)
      throw new BadRequestException('User with this id is not a driver.');

    const isAssigned = await this.vehicleModel.findOne({
      driverId,
    });
    if (isAssigned) {
      // assigned to same vehicle
      if (isAssigned._id.toString() === id)
        throw new BadRequestException(
          'Driver is already assigned to this vehicle',
        );

      // assigned to different vehicle
      throw new BadRequestException(
        'Driver is already assigned to another vehicle',
      );
    }

    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, { driverId }, { new: true })
      .populate('driverId', '-password -refreshToken -__v');
    if (!updatedVehicle)
      throw new NotFoundException('No vehicle found with this id.');

    const res: APIResponse = {
      message: 'Driver assigned to vehicle successfully',
      data: updatedVehicle,
    };
    return res;
  }

  async unAssignDriver(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('No vehicle found with this id.');
    if (!vehicle.driverId)
      throw new BadRequestException('Vehicle does not have an assigned driver');

    // driverId = null
    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      { $unset: { driverId: 1 } },
      { new: true },
    );

    const res: APIResponse = {
      message: 'Driver unassigned from vehicle successfully',
      data: updatedVehicle!,
    };

    return res;
  }
}

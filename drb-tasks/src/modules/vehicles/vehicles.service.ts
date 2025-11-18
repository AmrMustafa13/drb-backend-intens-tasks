import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from './schemas/vehicle .schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UsersService } from '../users/users.service';
import { UpdateVehicleDto } from './dtos/update-vehicle';
import { AssignDriverDto } from './dtos/assign-driver.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private userService: UsersService,
  ) {}

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    // check if driver exists
    if (createVehicleDto.driverId) {
      const driver = await this.userService.findOne(createVehicleDto.driverId);
      if (!driver) throw new NotFoundException('Driver not found');
    }
    // create vehicle
    const vehicle = this.vehicleModel.create(createVehicleDto);
    // return new vehicle
    return vehicle;
  }

  async getVehicleByID(vehicleId: string) {
    const vehicle = await this.vehicleModel
      .findById(vehicleId)
      .populate('driverId')
      .exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }
  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    if (dto.driverId) {
      const driverExists = await this.userService.findOne(dto.driverId);
      if (!driverExists) throw new NotFoundException('Driver not found');
    }

    const updatedVehicle = await this.vehicleModel
      // new to return the updated model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('driverId')
      .exec();

    if (!updatedVehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return updatedVehicle;
  }
  async deleteVehicle(vehicleId: string) {
    const deleted = await this.vehicleModel.findByIdAndDelete(vehicleId);
    if (!deleted) {
      throw new NotFoundException('Vehicle not found');
    }
    return {
      message: 'Vehicle deleted successfully',
      deleted,
    };
  }

  async assignDriver(vehicleId: string, assignDriver: AssignDriverDto) {
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    const driverAssigned = await this.vehicleModel.findOne({
      driverId: assignDriver.driverId,
      _id: { $ne: vehicleId },
    });

    if (driverAssigned)
      throw new BadRequestException(
        'Driver already assigned to another vehicle',
      );

    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(
        vehicleId,
        { driverId: assignDriver.driverId },
        { new: true },
      )
      .populate('driverId');

    /*
    If you have already checked that the vehicle exists before updating, 
    then findByIdAndUpdate will most likely return null only if the vehicle was deleted in between the check and the update (which is very rare).
    Therefore, the extra if (!updatedVehicle) check is not necessary 99% of the time, 
    but it is safe to include if you want to guard against any unexpected edge cases.
     */
    if (!updatedVehicle) throw new NotFoundException('Vehicle not found');

    return updatedVehicle;
  }

  async unAssignDriver(vehicleId: string) {
    if (!isValidObjectId(vehicleId)) {
      throw new BadRequestException('Invalid vehicleId');
    }
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    //  unassign driver to vehicle by update driverId of vehicle
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(vehicleId, { driverId: null }, { new: true })
      .populate('driverId');

    if (!updatedVehicle) throw new NotFoundException('Vehicle not found');

    return updatedVehicle;
  }
}

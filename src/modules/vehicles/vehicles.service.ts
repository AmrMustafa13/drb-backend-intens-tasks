import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { plateNumber, driverId } = createVehicleDto;

    // normalize plate number
    const normalizedPlateNo = plateNumber.trim().toUpperCase();

    // check duplicate plate no.
    const exists = await this.vehicleModel.findOne({
      plateNumber: normalizedPlateNo,
    });
    if (exists) {
      throw new ConflictException(this.i18n.t('vehicle.plateNoExist'));
    }

    // check driver exists
    if (driverId) {
      const driver = await this.userModel.findById(driverId);
      if (!driver) {
        throw new NotFoundException(this.i18n.t('driver.not_found'));
      }

      // check driver is available
      const exists = await this.vehicleModel.findOne({ driverId });
      if (exists) {
        throw new BadRequestException(this.i18n.t('driver.already_assigned'));
      }
    }

    // create the vehicle
    const vehicle = await this.vehicleModel.create({
      ...createVehicleDto,
      plateNumber: normalizedPlateNo,
    });

    return vehicle.toObject();
  }

  findAll() {
    return `This action returns all vehicles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}

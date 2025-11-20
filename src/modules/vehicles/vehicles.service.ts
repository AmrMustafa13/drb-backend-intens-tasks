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
import { GetVehiclesQueryDto } from './dto/get-vehicles.query.dto';

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

  async findAll(
    query: GetVehiclesQueryDto,
  ): Promise<{ page: number; limit: number; total: number; items: any[] }> {
    const {
      page = '1',
      limit = '10',
      type,
      manufacturer,
      assigned,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const filter: any = {};

    if (type) filter.type = type;

    if (manufacturer) filter.manufacturer = manufacturer;

    if (assigned === 'true') filter.driverId = { $ne: null };
    if (assigned === 'false') filter.driverId = null;

    const sort: any = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      this.vehicleModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      this.vehicleModel.countDocuments(filter),
    ]);

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      items,
    };
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

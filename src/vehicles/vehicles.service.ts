import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Model, SortOrder } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    private i18n: I18nService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateVehicleDto) {
    const existing = await this.vehicleModel.findOne({
      plateNumber: dto.plateNumber,
    });

    if (existing) {
      throw new BadRequestException(
        this.i18n.t('vehicle.plateExists', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const created = new this.vehicleModel(dto);
    return created.save();
  }

  async findAll(
    filter = {},
    limit = 10,
    page = 1,
    sort: { [key: string]: SortOrder } = { createdAt: -1 },
  ) {
    const skip = (page - 1) * limit;

    const query = this.vehicleModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('driverId', '-password');

    const vehicles = await query.exec();
    const count = await this.vehicleModel.countDocuments(filter);

    return { vehicles, total: count, page, limit };
  }

  async findById(id: string) {
    const vehicle = await this.vehicleModel
      .findById(id)
      .populate('driverId', '-password');

    if (!vehicle) {
      throw new NotFoundException(
        this.i18n.t('vehicle.notFound', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return vehicle;
  }

  async update(id: string, updates: UpdateVehicleDto) {
    const updated = await this.vehicleModel
      .findByIdAndUpdate(id, updates, { new: true })
      .populate('driverId', '-password');

    if (!updated) {
      throw new NotFoundException(
        this.i18n.t('vehicle.notFound', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.vehicleModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(
        this.i18n.t('vehicle.notFound', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return {
      message: this.i18n.t('vehicle.deleted', {
        lang: I18nContext.current()?.lang,
      }),
    };
  }

  async assignDriver(vehicleId: string, driverId: string) {
    const driver = await this.usersService.findOne(driverId);
    if (!driver || driver.role !== 'driver') {
      throw new BadRequestException(
        this.i18n.t('vehicle.invalidDriver', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const driverObjectId = new Types.ObjectId(driverId);

    const alreadyAssigned = await this.vehicleModel.findOne({
      driverId: driverObjectId,
    });

    if (alreadyAssigned) {
      throw new BadRequestException(
        this.i18n.t('vehicle.alreadyAssigned', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const updated = await this.vehicleModel
      .findByIdAndUpdate(vehicleId, { driverId: driverObjectId }, { new: true })
      .populate('driverId', '-password');

    if (!updated) {
      throw new NotFoundException(
        this.i18n.t('vehicle.notFound', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return updated;
  }
  async unassignDriver(vehicleId: string) {
    const updated = await this.vehicleModel.findByIdAndUpdate(
      vehicleId,
      { driverId: null },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(
        this.i18n.t('vehicle.notFound', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return updated;
  }
}

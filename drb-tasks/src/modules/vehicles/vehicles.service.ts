import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from './schemas/vehicle .schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UsersService } from '../users/users.service';
import { UpdateVehicleDto } from './dtos/update-vehicle';
import { AssignDriverDto } from './dtos/assign-driver.dto';
import { VehiclesQueryDto } from './dtos/vehicle-query.dto';
import { PaginatedResult } from './interfaces/paginated-response.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private userService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  private get lang(): string {
    return I18nContext.current()?.lang || 'en';
  }

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    // check if driver exists
    if (createVehicleDto.driverId) {
      const driver = await this.userService.findOne(createVehicleDto.driverId);
      if (!driver)
        throw new NotFoundException(
          this.i18n.t('vehicle.DRIVER_NOT_FOUND', { lang: this.lang }),
        );
    }
    // create vehicle
    const vehicle = this.vehicleModel.create(createVehicleDto);
    // return new vehicle
    return vehicle;
  }

  async getAllVehicles(
    queryDto: VehiclesQueryDto,
  ): Promise<PaginatedResult<Vehicle>> {
    const {
      page = 1,
      limit = 10,
      type,
      manufacturer,
      assigned,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    // build filter
    const filter: FilterQuery<Vehicle> = {};
    if (manufacturer) {
      filter.manufacturer = { $regex: manufacturer, $options: 'i' };
    }
    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }

    // handle assigned/unassigned
    if (assigned === 'assigned') {
      filter.driverId = { $ne: null };
    } else if (assigned === 'unassigned') {
      filter.driverId = null;
    }

    const total = await this.vehicleModel.countDocuments(filter);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const data = await this.vehicleModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('driverId')
      .lean()
      .exec();

    return {
      data: data as Vehicle[],
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        lastPage: Math.ceil(total / limitNumber),
      },
    };
  }

  async getVehicleByID(vehicleId: string) {
    const vehicle = await this.vehicleModel
      .findById(vehicleId)
      .populate('driverId')
      .exec();
    if (!vehicle)
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );
    return vehicle;
  }

  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    if (dto.driverId) {
      const driverExists = await this.userService.findOne(dto.driverId);
      if (!driverExists)
        throw new NotFoundException(
          this.i18n.t('vehicle.DRIVER_NOT_FOUND', { lang: this.lang }),
        );
    }

    const updatedVehicle = await this.vehicleModel
      // new to return the updated model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('driverId')
      .exec();

    if (!updatedVehicle) {
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );
    }
    return updatedVehicle;
  }

  async deleteVehicle(vehicleId: string) {
    const deleted = await this.vehicleModel.findByIdAndDelete(vehicleId);
    if (!deleted) {
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );
    }
    return {
      message: this.i18n.t('vehicle.VEHICLE_DELETED', { lang: this.lang }),
      deleted,
    };
  }

  async assignDriver(vehicleId: string, assignDriver: AssignDriverDto) {
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );
    }
    const driverAssigned = await this.vehicleModel.findOne({
      driverId: assignDriver.driverId,
      _id: { $ne: vehicleId },
    });

    if (driverAssigned)
      throw new BadRequestException(
        this.i18n.t('vehicle.DRIVER_ALREADY_ASSIGNED', { lang: this.lang }),
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
    if (!updatedVehicle)
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );

    return updatedVehicle;
  }

  async unAssignDriver(vehicleId: string) {
    if (!isValidObjectId(vehicleId)) {
      throw new BadRequestException(
        this.i18n.t('vehicle.INVALID_VEHICLE_ID', { lang: this.lang }),
      );
    }
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );
    }

    //  unassign driver to vehicle by update driverId of vehicle
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(vehicleId, { driverId: null }, { new: true })
      .populate('driverId');

    if (!updatedVehicle)
      throw new NotFoundException(
        this.i18n.t('vehicle.VEHICLE_NOT_FOUND', { lang: this.lang }),
      );

    return updatedVehicle;
  }
}

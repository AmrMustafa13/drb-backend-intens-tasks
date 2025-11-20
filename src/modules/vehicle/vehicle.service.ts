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
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class VehicleService {
  constructor(
    private readonly i18n: I18nService,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      if (createVehicleDto.driverId) {
        const driver = await this.userModel.findById(createVehicleDto.driverId);

        if (!driver) {
          throw new NotFoundException(
            this.i18n.t('exceptions.NO_DRIVER', {
              lang: I18nContext.current()?.lang,
            }),
          );
        }

        if (driver.role !== UserRole.DRIVER) {
          throw new BadRequestException(
            this.i18n.t('exceptions.NOT_A_DRIVER', {
              lang: I18nContext.current()?.lang,
            }),
          );
        }
      }

      const vehicle = await this.vehicleModel.create(createVehicleDto);

      const res: APIResponse = {
        message: this.i18n.t('messages.VEHICLE_CREATED', {
          lang: I18nContext.current()?.lang,
        }),
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
        throw new ConflictException(
          this.i18n.t('exceptions.SAME_P_NO', {
            lang: I18nContext.current()?.lang,
          }),
        );
      }
      throw new InternalServerErrorException(
        this.i18n.t('exceptions.FAILED', {
          lang: I18nContext.current()?.lang,
        }),
      );
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

    if (!vehicle)
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

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
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const res: APIResponse = {
      data: updatedVehicle,
    };
    return res;
  }

  async deleteOne(id: string) {
    const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id);
    if (!deletedVehicle)
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const res: APIResponse = {
      message: this.i18n.t('messages.VEHICLE_DELETED', {
        lang: I18nContext.current()?.lang,
      }),
    };
    return res;
  }

  async assignDriver(id: string, driverId: string) {
    // check if user exists, and is a driver
    const driver = await this.userModel.findById(driverId);

    if (!driver)
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_DRIVER', {
          lang: I18nContext.current()?.lang,
        }),
      );
    if (driver.role !== UserRole.DRIVER)
      throw new BadRequestException(
        this.i18n.t('exceptions.NOT_A_DRIVER', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const isAssigned = await this.vehicleModel.findOne({
      driverId,
    });
    if (isAssigned) {
      // assigned to same vehicle
      if (isAssigned._id.toString() === id)
        throw new BadRequestException(
          this.i18n.t('exceptions.ASSIGNED_TO_THIS', {
            lang: I18nContext.current()?.lang,
          }),
        );

      // assigned to different vehicle
      throw new BadRequestException(
        this.i18n.t('exceptions.ASSIGNED_TO_ANOTHER', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, { driverId }, { new: true })
      .populate('driverId', '-password -refreshToken -__v');
    if (!updatedVehicle)
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

    const res: APIResponse = {
      message: this.i18n.t('messages.DRIVER_ASSIGNED', {
        lang: I18nContext.current()?.lang,
      }),
      data: updatedVehicle,
    };
    return res;
  }

  async unAssignDriver(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle)
      throw new NotFoundException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );
    if (!vehicle.driverId)
      throw new BadRequestException(
        this.i18n.t('exceptions.NO_VEHICLE', {
          lang: I18nContext.current()?.lang,
        }),
      );

    // driverId = null
    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      { $unset: { driverId: 1 } },
      { new: true },
    );

    const res: APIResponse = {
      message: this.i18n.t('messages.DRIVER_UNASSIGNED', {
        lang: I18nContext.current()?.lang,
      }),
      data: updatedVehicle!,
    };

    return res;
  }
}

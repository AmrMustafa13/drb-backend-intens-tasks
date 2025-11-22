import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Create a new vehicle
   * @param createVehicleDto Vehicle creation data
   * @returns Created vehicle with populated driver info
   */
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      // Convert plate number to uppercase and trim
      const plateNumber = createVehicleDto.plateNumber.toUpperCase().trim();

      // Check if plate number already exists
      const existingVehicle = await this.vehicleModel.findOne({ plateNumber });

      if (existingVehicle) {
        throw new ConflictException(
          this.i18n.t('errors.vehicle.plateNumberExists'),
        );
      }

      // If driver is assigned, validate driver exists and is not already assigned
      if (createVehicleDto.driverId) {
        await this.validateDriver(createVehicleDto.driverId);
      }

      // Create vehicle with uppercase plate number
      const vehicle = new this.vehicleModel({
        ...createVehicleDto,
        plateNumber,
      });

      await vehicle.save();

      // Return populated vehicle
      return this.findById(vehicle._id.toString());
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        this.i18n.t('errors.vehicle.createFailed'),
      );
    }
  }

  /**
   * Get all vehicles with pagination, filtering, and sorting
   * @param query Query parameters for filtering and pagination
   * @returns Paginated list of vehicles
   */
  async findAll(query: VehicleQueryDto = new VehicleQueryDto()) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        manufacturer,
        assignmentStatus,
        sortBy = '-createdAt',
        search,
      } = query;

      const filter: any = {};

      if (type) filter.type = type;
      if (manufacturer)
        filter.manufacturer = { $regex: manufacturer, $options: 'i' };
      if (assignmentStatus === 'assigned') filter.driverId = { $ne: null };
      if (assignmentStatus === 'unassigned') filter.driverId = null;
      if (search) {
        filter.$or = [
          { plateNumber: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
          { manufacturer: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [vehicles, total] = await Promise.all([
        this.vehicleModel
          .find(filter)
          .populate('driverId', 'name email phone role')
          .sort(sortBy)
          .skip(skip)
          .limit(limit)
          .lean(),
        this.vehicleModel.countDocuments(filter),
      ]);

      return {
        data: vehicles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      };
    } catch {
      throw new InternalServerErrorException('Failed to retrieve vehicles');
    }
  }

  /**
   * Get vehicle by ID
   * @param id Vehicle MongoDB ObjectId
   * @returns Vehicle with populated driver information
   */
  async findById(id: string) {
    // Validate MongoDB ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(this.i18n.t('errors.vehicle.invalidId'));
    }

    const vehicle = await this.vehicleModel
      .findById(id)
      .populate('driverId', 'name email phone role')
      .lean()
      .exec();

    if (!vehicle) {
      throw new NotFoundException(this.i18n.t('errors.vehicle.notFound'));
    }

    return vehicle;
  }

  /**
   * Update vehicle information
   * @param id Vehicle MongoDB ObjectId
   * @param updateVehicleDto Updated vehicle data
   * @returns Updated vehicle with populated driver info
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      // First verify vehicle exists
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        throw new NotFoundException(this.i18n.t('errors.vehicle.notFound'));
      }

      // If driver is being updated, validate the new driver
      if (
        updateVehicleDto.driverId &&
        updateVehicleDto.driverId !== vehicle.driverId?.toString()
      ) {
        await this.validateDriver(updateVehicleDto.driverId);
      }

      // Update vehicle fields
      Object.assign(vehicle, updateVehicleDto);
      await vehicle.save();

      // Return updated vehicle with populated driver
      return this.findById(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        this.i18n.t('errors.vehicle.updateFailed'),
      );
    }
  }

  /**
   * Delete vehicle
   * @param id Vehicle MongoDB ObjectId
   * @returns Success message
   */
  async remove(id: string) {
    try {
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        throw new NotFoundException(this.i18n.t('errors.vehicle.notFound'));
      }

      await vehicle.deleteOne();

      return {
        message: this.i18n.t('messages.vehicle.deleted'),
        deletedVehicle: {
          id: vehicle._id,
          plateNumber: vehicle.plateNumber,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        this.i18n.t('errors.vehicle.deleteFailed'),
      );
    }
  }

  /**
   * Assign driver to vehicle
   * @param id Vehicle MongoDB ObjectId
   * @param assignDriverDto Driver assignment data
   * @returns Updated vehicle with assigned driver
   */
  async assignDriver(id: string, assignDriverDto: AssignDriverDto) {
    try {
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        throw new NotFoundException(this.i18n.t('errors.vehicle.notFound'));
      }

      // Validate driver
      const driver = await this.validateDriver(assignDriverDto.driverId);

      // Assign driver
      vehicle.driverId = new Types.ObjectId(assignDriverDto.driverId);
      await vehicle.save();

      // Return vehicle with populated driver info
      return this.findById(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        this.i18n.t('errors.driver.assignmentFailed'),
      );
    }
  }

  /**
   * Unassign driver from vehicle
   * @param id Vehicle MongoDB ObjectId
   * @returns Updated vehicle without driver
   */
  async unassignDriver(id: string) {
    try {
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        throw new NotFoundException(this.i18n.t('errors.vehicle.notFound'));
      }

      if (!vehicle.driverId) {
        throw new BadRequestException(
          this.i18n.t('errors.vehicle.noDriverAssigned'),
        );
      }

      // Remove driver assignment
      vehicle.driverId = null;
      await vehicle.save();

      // Return vehicle with no driver
      return this.findById(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to unassign driver');
    }
  }

  /**
   * Validate driver exists and is not assigned to another vehicle
   * @param driverId Driver MongoDB ObjectId
   * @returns Driver document if valid
   * @throws BadRequestException if driver ID is invalid
   * @throws NotFoundException if driver doesn't exist
   * @throws ConflictException if driver is already assigned
   */
  private async validateDriver(driverId: string) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(driverId)) {
      throw new BadRequestException(this.i18n.t('errors.driver.invalidId'));
    }

    // Check if driver exists
    const driver = await this.userModel.findById(driverId);
    if (!driver) {
      throw new NotFoundException(this.i18n.t('errors.driver.notFound'));
    }

    // Check if driver is already assigned to another vehicle
    const assignedVehicle = await this.vehicleModel.findOne({
      driverId: new Types.ObjectId(driverId),
    });

    if (assignedVehicle) {
      throw new ConflictException(this.i18n.t('errors.driver.alreadyAssigned'));
    }

    return driver;
  }
}

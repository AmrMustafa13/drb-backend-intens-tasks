import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto, VehicleQueryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationUtil } from 'src/common/utils/pagination.util';
import { PaginatedResult } from 'src/common/interfaces/pagination.interface';
import { Vehicle } from '@prisma/client';
import { UpdateVehicleDto } from './dto/UpdateVehicleDto.dto';

@Injectable()
export class VehicleService {
	constructor(private prisma: PrismaService) {}
	async updateVehicle(id: string, dto: UpdateVehicleDto) {
		// Check if the vehicle exists
		const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${id} not found`);
		}

		// If driverId is explicitly provided in the DTO, validate the driver
		if (dto.driverId) {
			// Check if driver exists
			const driver = await this.prisma.user.findUnique({
				where: { id: dto.driverId },
			});

			if (!driver) {
				throw new NotFoundException(`Driver with ID ${dto.driverId} not found`);
			}

			// Check if driver is already assigned to another vehicle
			const assignedVehicle = await this.prisma.vehicle.findFirst({
				where: {
					driverId: dto.driverId,
					NOT: { id }, // Exclude current vehicle
				},
			});

			if (assignedVehicle) {
				throw new ConflictException(
					`Driver is already assigned to vehicle with plate number ${assignedVehicle.plateNumber}`,
				);
			}
		}

		// Update the vehicle (only with provided fields)
		const updatedVehicle = await this.prisma.vehicle.update({
			where: { id },
			data: dto,
			include: {
				driver: {
					select: { id: true, name: true, email: true, phone: true },
				},
			},
		});

		return updatedVehicle;
	}

	async GetVehicleById(id: string): Promise<Vehicle> {
		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id },
			include: {
				driver: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${id} not found`);
		}

		return vehicle;
	}

	async GetAllVehicles(
		query: VehicleQueryDto,
	): Promise<PaginatedResult<Vehicle>> {
		const {
			page = 1,
			limit = 10,
			sortBy = 'createdAt',
			sortOrder = 'desc',
			type,
			manufacturer,
			assigned,
		} = query;

		// Build where clause for filtering
		const where: any = {};

		if (type) {
			where.type = { contains: type, mode: 'insensitive' };
		}

		if (manufacturer) {
			where.manufacturer = { contains: manufacturer, mode: 'insensitive' };
		}

		if (assigned !== undefined) {
			where.driverId = assigned === 'true' ? { not: null } : null;
		}

		// Calculate skip
		const skip = PaginationUtil.getSkip(page, limit);

		// Build orderBy clause
		const orderBy: any = {};
		orderBy[sortBy] = sortOrder;

		try {
			// Execute queries in parallel
			const [vehicles, total] = await Promise.all([
				this.prisma.vehicle.findMany({
					where,
					skip,
					take: limit,
					orderBy,
					include: {
						driver: {
							select: {
								id: true,
								name: true,
								email: true,
								phone: true,
							},
						},
					},
				}),
				this.prisma.vehicle.count({ where }),
			]);

			return PaginationUtil.paginate(vehicles, total, page, limit);
		} catch (error) {
			throw new BadRequestException('Failed to fetch vehicles');
		}
	}

	async CreateVehicle(dto: CreateVehicleDto): Promise<Vehicle> {
		// check if exite before
		const exite = await this.prisma.vehicle.findFirst({
			where: { plateNumber: dto.plateNumber },
		});

		// if yes, throw conflict error
		if (exite) {
			throw new ConflictException('This vehicle already exists');
		}

		// if not , then check about the driver if his id is correct or no
		const driverId = dto.driverId;
		if (driverId) {
			const driver = await this.prisma.user.findFirst({
				where: { id: driverId },
			});
			if (!driver) {
				throw new NotFoundException("Can't find this driver");
			}
		}

		// if yes, then create a new vehicle
		const vehicle = await this.prisma.vehicle.create({
			data: {
				plateNumber: dto.plateNumber,
				model: dto.model,
				manufacturer: dto.manufacturer,
				year: dto.year,
				type: dto.type,
				simNumber: dto.simNumber || '',
				deviceId: dto.deviceId || '',
				driver: dto.driverId ? { connect: { id: dto.driverId } } : undefined,
			},
			include: {
				driver: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		return vehicle;
	}

	async deleteVehicle(id: string) {
		// Check if the vehicle exists
		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id },
		});

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${id} not found`);
		}

		// Delete the vehicle
		await this.prisma.vehicle.delete({
			where: { id },
		});

		return {
			message: 'Vehicle deleted successfully',
			deletedVehicle: {
				id: vehicle.id,
				plateNumber: vehicle.plateNumber,
				model: vehicle.model,
				manufacturer: vehicle.manufacturer,
			},
		};
	}

	async assignDriver(vehicleId: string, driverId: string) {
		// Check if vehicle exists
		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id: vehicleId },
		});

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
		}

		// Check if vehicle already has a driver
		if (vehicle.driverId) {
			throw new ConflictException(
				'Vehicle already has an assigned driver. Please unassign the current driver first.',
			);
		}

		// Check if driver exists
		const driver = await this.prisma.user.findUnique({
			where: { id: driverId },
		});

		if (!driver) {
			throw new NotFoundException(`Driver with ID ${driverId} not found`);
		}

		// Check if driver is already assigned to another vehicle
		const assignedVehicle = await this.prisma.vehicle.findFirst({
			where: { driverId },
		});

		if (assignedVehicle) {
			throw new ConflictException(
				`Driver is already assigned to vehicle with plate number ${assignedVehicle.plateNumber}`,
			);
		}

		// Assign driver to vehicle
		const updatedVehicle = await this.prisma.vehicle.update({
			where: { id: vehicleId },
			data: { driverId },
			include: {
				driver: {
					select: { id: true, name: true, email: true, phone: true },
				},
			},
		});

		return {
			message: 'Driver assigned successfully',
			vehicle: updatedVehicle,
		};
	}

	async unassignDriver(vehicleId: string) {
		// Check if vehicle exists
		const vehicle = await this.prisma.vehicle.findUnique({
			where: { id: vehicleId },
		});

		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
		}

		// Check if vehicle has an assigned driver
		if (!vehicle.driverId) {
			throw new BadRequestException('Vehicle does not have an assigned driver');
		}

		// Unassign driver from vehicle
		const updatedVehicle = await this.prisma.vehicle.update({
			where: { id: vehicleId },
			data: { driverId: null },
			select: {
				id: true,
				plateNumber: true,
				model: true,
				manufacturer: true,
				year: true,
				type: true,
				simNumber: true,
				deviceId: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return {
			message: 'Driver unassigned successfully',
			vehicle: updatedVehicle,
		};
	}
}

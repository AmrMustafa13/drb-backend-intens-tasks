import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '../schemas/vehicle.schema';

export class VehicleQueryDto {
  @ApiPropertyOptional({ 
    description: 'Page number for pagination (starts from 1)',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.page.int' })
  @Min(1, { message: 'validation.page.min' })
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.limit.int' })
  @Min(1, { message: 'validation.limit.min' })
  @Max(100, { message: 'validation.limit.max' })
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Filter vehicles by type',
    enum: VehicleType,
    enumName: 'VehicleType',
    example: VehicleType.CAR,
    examples: ['car', 'van', 'bus', 'truck', 'motorcycle']
  })
  @IsOptional()
  @IsEnum(VehicleType, { message: 'validation.type.enum' })
  type?: VehicleType;

  @ApiPropertyOptional({ 
    description: 'Filter vehicles by manufacturer (case-insensitive partial match)',
    example: 'Toyota',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'validation.manufacturer.string' })
  manufacturer?: string;

  @ApiPropertyOptional({ 
    description: 'Filter vehicles by driver assignment status',
    enum: ['assigned', 'unassigned'],
    example: 'assigned',
    examples: ['assigned', 'unassigned']
  })
  @IsOptional()
  @IsEnum(['assigned', 'unassigned'], { 
    message: 'validation.assignmentStatus.enum' 
  })
  assignmentStatus?: 'assigned' | 'unassigned';

  @ApiPropertyOptional({ 
    description: 'Sort by field. Prefix with "-" for descending order. Examples: "plateNumber", "-createdAt", "year"',
    example: '-createdAt',
    default: '-createdAt',
    type: String,
    examples: ['plateNumber', '-plateNumber', 'year', '-year', 'createdAt', '-createdAt', 'manufacturer', '-manufacturer']
  })
  @IsOptional()
  @IsString({ message: 'validation.sortBy.string' })
  sortBy?: string = '-createdAt';

  @ApiPropertyOptional({ 
    description: 'Search term to filter vehicles by plate number, model, or manufacturer (case-insensitive)',
    example: 'Toyota Camry',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'validation.search.string' })
  search?: string;
}
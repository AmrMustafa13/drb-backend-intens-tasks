import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumberString,
  IsEnum,
  IsString,
  IsBooleanString,
} from 'class-validator';
import { Type } from '../enums/Type.enum';

export class GetVehiclesQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Vehicle type filter',
    example: 'CAR',
    required: false,
    enum: Type,
  })
  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @ApiPropertyOptional({
    description: 'Manufacturer name filter',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    description:
      'Filter vehicles by assignment: true = assigned, false = unassigned',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  assigned?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'plateNumber',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order: asc or desc',
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @IsString()
  order?: string;
}

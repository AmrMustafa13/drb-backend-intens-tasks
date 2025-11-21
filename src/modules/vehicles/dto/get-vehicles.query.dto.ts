import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumberString,
  IsEnum,
  IsString,
  IsBooleanString,
} from 'class-validator';
import { Type } from '../enums/Type.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetVehiclesQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString({}, { message: i18nValidationMessage('validation.isNumber') })
  limit?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString({}, { message: i18nValidationMessage('validation.isNumber') })
  page?: string;

  @ApiPropertyOptional({
    description: 'Vehicle type filter',
    example: 'CAR',
    required: false,
    enum: Type,
  })
  @IsOptional()
  @IsEnum(Type, { message: i18nValidationMessage('validation.isEnumType') })
  type?: Type;

  @ApiPropertyOptional({
    description: 'Manufacturer name filter',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  manufacturer?: string;

  @ApiPropertyOptional({
    description:
      'Filter vehicles by assignment: true = assigned, false = unassigned',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString({ message: i18nValidationMessage('validation.isBoolean') })
  assigned?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'plateNumber',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order: asc or desc',
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  order?: string;
}

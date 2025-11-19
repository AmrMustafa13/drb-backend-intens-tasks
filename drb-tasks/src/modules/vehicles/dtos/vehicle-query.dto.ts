import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class VehiclesQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsIn(['assigned', 'unassigned'])
  assigned?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'year', 'model'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

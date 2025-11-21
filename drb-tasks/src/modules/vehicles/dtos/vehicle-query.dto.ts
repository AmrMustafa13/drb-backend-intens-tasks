import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VehiclesQueryDto {
  @IsOptional()
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.IS_NUMBER_STRING') },
  )
  page?: string;

  @IsOptional()
  @IsNumberString(
    {},
    { message: i18nValidationMessage('validation.IS_NUMBER_STRING') },
  )
  limit?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsIn(['assigned', 'unassigned'], {
    message: i18nValidationMessage('validation.IS_IN'),
  })
  assigned?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'year', 'model'], {
    message: i18nValidationMessage('validation.IS_IN'),
  })
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: i18nValidationMessage('validation.IS_IN') })
  sortOrder?: 'asc' | 'desc';
}

import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const ASSIGNED_VALUES = ['true', 'false'];

export class VehicleQueryDto extends PaginationDto {
	@ApiPropertyOptional({ description: 'Filter by vehicle type' })
	@IsOptional()
	@IsString({
		message: i18nValidationMessage('common.IS_STRING'),
	})
	type?: string;

	@ApiPropertyOptional({ description: 'Filter by manufacturer' })
	@IsOptional()
	@IsString({
		message: i18nValidationMessage('common.IS_STRING'),
	})
	manufacturer?: string;

	@ApiPropertyOptional({
		enum: ASSIGNED_VALUES,
		description: 'Filter by assignment status',
	})
	@IsOptional()
	@IsIn(ASSIGNED_VALUES, {
		message: i18nValidationMessage('validation.common.IS_IN', {
			value: ASSIGNED_VALUES.join(', '),
		}),
	})
	assigned?: 'true' | 'false';
}

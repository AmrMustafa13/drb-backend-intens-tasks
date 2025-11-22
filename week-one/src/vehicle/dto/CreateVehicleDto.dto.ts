import { ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

const NEXT_YEAR = new Date().getFullYear() + 1;

export class CreateVehicleDto {
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	plateNumber: string;

	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	model: string;

	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	manufacturer: string;

	@Min(1980, {
		message: i18nValidationMessage('validation.common.MIN_VALUE', {
			min: 1980,
		}),
	})
	@Max(NEXT_YEAR, {
		message: i18nValidationMessage('validation.common.MAX_VALUE', {
			max: NEXT_YEAR,
		}),
	})
	@IsNumber(
		{},
		{ message: i18nValidationMessage('validation.common.IS_NUMBER') },
	)
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	year: number;

	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	type: string;

	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsOptional()
	simNumber?: string;

	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@IsOptional()
	deviceId?: string;

	@IsMongoId({
		message: i18nValidationMessage('validation.common.IS_MONGO_ID'),
	})
	@IsOptional()
	driverId?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Role } from 'src/enums/roles.enum';

export class RegisterDto {
	@ApiProperty()
	@IsEmail({}, { message: i18nValidationMessage('validation.common.IS_EMAIL') })
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	email: string;

	@ApiProperty()
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	@MinLength(8, {
		message: i18nValidationMessage('validation.common.MIN_LENGTH', {
			min: 8,
		}),
	})
	password: string;

	@ApiProperty()
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	phone?: string;

	@ApiProperty({ enum: Role })
	@IsOptional()
	@IsEnum(Role, {
		message: i18nValidationMessage('validation.common.IS_ENUM'),
	})
	role: Role;
}

import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Role } from 'src/enums/roles.enum';

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsEmail({}, { message: i18nValidationMessage('validation.common.IS_EMAIL') })
	email: string;

	@ApiProperty()
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	password: string;

	@ApiProperty({ enum: Role })
	@IsOptional()
	@IsEnum(Role, {
		message: i18nValidationMessage('validation.common.IS_ENUM'),
	})
	role: Role;
}

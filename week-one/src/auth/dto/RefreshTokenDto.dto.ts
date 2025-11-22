import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto {
	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	refreshToken: string;

	@IsNotEmpty({
		message: i18nValidationMessage('validation.common.IS_NOT_EMPTY'),
	})
	@IsString({
		message: i18nValidationMessage('validation.common.IS_STRING'),
	})
	userId: string;
}

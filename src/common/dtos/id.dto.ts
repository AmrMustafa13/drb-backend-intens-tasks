import { IsMongoId } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class IdDto {
  @IsMongoId({ message: i18nValidationMessage('validation.ID_INVALID') })
  id: string;
}

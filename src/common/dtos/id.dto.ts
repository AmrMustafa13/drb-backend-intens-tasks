import { IsMongoId } from 'class-validator';

export class IdDto {
  @IsMongoId({ message: 'Id must be a valid MongoDB ObjectId' })
  id: string;
}

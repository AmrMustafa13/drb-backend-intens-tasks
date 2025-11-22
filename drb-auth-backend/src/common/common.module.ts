import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './guards/roles.guard';
import { User, UserSchema } from '../users/schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RolesGuard],
  exports: [RolesGuard, MongooseModule],
})
export class CommonModule {}
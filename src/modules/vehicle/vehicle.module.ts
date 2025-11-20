import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { VehicleService } from './vehicle.service';
import { TokenModule } from '../token/token.module';
import { VehicleController } from './vehicle.controller';
import { Vehicle, VehicleSchema } from 'src/database/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    AuthModule,
    TokenModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}

import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehcilesController } from './vehicles.controller';

@Module({
  controllers: [VehcilesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}

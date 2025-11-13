import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from './config/env';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [env],
    }),
    HealthModule,
  ],
})
export class AppModule {}

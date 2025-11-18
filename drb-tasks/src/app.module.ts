import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
// import validationSchema from './config/validation.schema';

@Module({
  imports: [
    // builder.service.addSomething
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
      // validationSchema,
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // without it nestjs by default will search for .env file
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

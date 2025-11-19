import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import dotenv from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import * as path from 'path';

dotenv.config();

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver], // reads Accept-Language header
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UserModule,
    VehiclesModule,
  ],
})
export class AppModule {}

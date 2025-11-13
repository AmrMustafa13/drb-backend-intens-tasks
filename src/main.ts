import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

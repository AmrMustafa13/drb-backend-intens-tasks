import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  I18nService,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { I18nExceptionFilter } from './common/filters/i18n-exception.filter';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  const i18nService = app.get(I18nService) as I18nService<Record<string, unknown>>;

  app.useGlobalFilters(new I18nExceptionFilter(i18nService));

  const config = new DocumentBuilder()
    .setTitle('Fleet & Vehicle Management Module')
    .setDescription('Fleet & Vehicle Management System for DRB Intership')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

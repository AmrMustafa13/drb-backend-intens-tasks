import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on: http://localhost:${port}/api/v1`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

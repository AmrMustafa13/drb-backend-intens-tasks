import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new I18nValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useGlobalFilters(
		new I18nValidationExceptionFilter({
			detailedErrors: false,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('DRB Task-One')
		.setDescription('Week one task documentation')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.PORT ?? 5050);
}
bootstrap();

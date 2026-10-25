import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookie_parser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api');
    app.enableCors({
      origin: configService.get('CLIENT_ORIGINS'),
      credentials: true,
    });
    app.use(cookie_parser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    const port = configService.get<number>('PORT') ?? 3000;

    await app.listen(port);

    console.log(`Application running on http://localhost:${port}/`);
  } catch (e) {
    console.error('Bootstrap failed');
    console.error(e);
  }
}
await bootstrap();

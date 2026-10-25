import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookie_parser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({ origin: process.env.CLIENT_ORIGINS!, credentials: true });
  app.use(cookie_parser());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT!);
}
await bootstrap();

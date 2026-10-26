import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookie_parser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import  express from 'express';

const server = express();

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    
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
    
    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const listener = await bootstrap();
  listener(req, res);
};


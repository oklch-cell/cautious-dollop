import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import { UserModule } from './modules/user/user.module.js';
import { MessageService } from './modules/message/message.service.js';

@Module({
  imports: [
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
    }),
    UserModule,
    MessageService,
  ],
})
export class AppModule {}

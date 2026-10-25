import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import { UserModule } from './modules/user/user.module.js';
import { MessageModule } from './modules/message/message.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway.js';

@Module({
  imports: [
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
    }),
    UserModule,
    MessageModule,
    AuthModule,
    JwtModule.register({}),
  ],
  providers: [AppGateway],
})
export class AppModule {}

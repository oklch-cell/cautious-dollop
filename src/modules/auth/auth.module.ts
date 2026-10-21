import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SessionService } from './session.service.js';
import { UserService } from '../user/user.service.js';
import { AuthController } from './auth.controller.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, SessionService, UserService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}

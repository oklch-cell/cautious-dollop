import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserService } from '../user/user.service.js';
import { AuthController } from './auth.controller.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, UserService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}

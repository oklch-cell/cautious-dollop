import { Module } from '@nestjs/common';
import { MessageService } from './message.service.js';
import { MessageController } from './message.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';

@Module({
  imports: [JwtModule.register({})],
  providers: [MessageService, UserService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}

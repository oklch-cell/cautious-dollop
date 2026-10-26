import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../modules/user/user.service.js';

import { User } from '../../database/schema.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userSerivce: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("COOKIE GUARD ENTERED!");

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();

    const cookie = request.cookies['refresh_token'];
    if (!cookie) {
      throw new UnauthorizedException('Cookie not found');
    }

    try {
      const { sub } = await this.jwtService.verifyAsync(cookie, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      if (!sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userSerivce.getById(sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      Reflect.deleteProperty(user, 'password_hash');

      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }

    return true;
  }
}

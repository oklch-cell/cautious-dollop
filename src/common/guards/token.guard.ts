import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../database/schema.js';

@Injectable()
export class TokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const { id, access_token, access_token_expires_at } = request.user;

      if (
        !id ||
        !access_token ||
        !access_token_expires_at ||
        access_token !== token
      ) {
        throw new UnauthorizedException('Invalid session');
      }

      if (access_token_expires_at < new Date(Date.now()).toISOString()) {
        throw new UnauthorizedException('Session expired');
      }
    } catch (e) {
      throw new UnauthorizedException(e);
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}

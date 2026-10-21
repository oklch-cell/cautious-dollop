import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { randomBytes } from 'crypto';

import type {
  LoginDto,
  PasswordDto,
  SignupDto,
  UpdateDto,
} from './auth.dto.js';
import type { Response } from 'express';
import type { User } from '../../database/schema.js';

import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ username, email, password }: SignupDto, response: Response) {
    const existing_user = await this.userService.getByEmail(email);
    if (existing_user) {
      throw new ConflictException('Email already registered');
    }

    const access_token = randomBytes(32).toString('hex');

    const user = await this.userService.create({
      username,
      email,
      password_hash: password,
      access_token,
      access_token_expires_at: new Date(
        Date.now() + 12 * 60 * 60 * 1000,
      ).toISOString(),
    });

    const refresh_token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, username: user.username },
      { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: '7d' },
    );

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(201).json({ session: user });
  }

  async login({ email, password }: LoginDto, response: Response) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const matches = await compare(password, user.password_hash);
    if (!matches) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const access_token = randomBytes(32).toString('hex');
    const refresh_token = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, username: user.username },
      { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: '7d' },
    );

    const session = await this.userService.update(user.id, {
      access_token,
      access_token_expires_at: new Date(
        Date.now() + 12 * 60 * 60 * 1000,
      ).toISOString(),
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.status(200).json({ session });
  }

  async authenticate(user: User) {
    const access_token = randomBytes(32).toString('hex');

    const session = await this.userService.update(user.id, {
      access_token,
      access_token_expires_at: new Date(
        Date.now() + 12 * 60 * 60 * 1000,
      ).toISOString(),
    });

    return { session };
  }

  async delete({ id }: User, res: Response) {
    res.clearCookie('refresh_token');
    await this.userService.delete(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  }

  async logout({ id }: User, res: Response) {
    res.clearCookie('refresh_token');
    await this.userService.update(id, {
      access_token: null,
      access_token_expires_at: new Date(Date.now()).toISOString(),
    });
    return res.status(200).json({ message: 'User logged out successfully' });
  }

  async update({ id }: User, dto: UpdateDto) {
    return await this.userService.update(id, dto);
  }

  async changePassword(
    { id }: User,
    { old_password, new_password }: PasswordDto,
  ) {
    const user = await this.userService.changePassword(
      id,
      new_password,
      old_password,
    );
    return { user };
  }
}

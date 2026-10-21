import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { LoginDto, PasswordDto, SignupDto, UpdateDto } from './auth.dto.js';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { CookieGuard } from '../../common/guards/cookie.guard.js';
import type { User } from '../../database/schema.js';
import { TokenGuard } from '../../common/guards/token.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    return await this.authService.signup(dto, res);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return await this.authService.login(dto, res);
  }

  @Get('me')
  @UseGuards(CookieGuard)
  async authenticate(@Req() request: Request & { user: User }) {
    return await this.authService.authenticate(request.user);
  }

  @Patch()
  @UseGuards(CookieGuard, TokenGuard)
  async update(@CurrentUser() user: User, @Body() dto: UpdateDto) {
    return await this.authService.update(user, dto);
  }

  @Patch('password')
  @UseGuards(CookieGuard, TokenGuard)
  async updatePassword(@CurrentUser() user: User, @Body() dto: PasswordDto) {
    return await this.authService.changePassword(user, dto);
  }

  @Delete()
  @UseGuards(CookieGuard, TokenGuard)
  async delete(@CurrentUser() user: User) {
    return await this.authService.delete(user);
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { users } from '../../database/schema.js';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { NewUser } from '../../database/schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly database: PostgresJsDatabase,
  ) {}

  async create({
    username,
    email,
    password_hash,
    access_token,
    access_token_expires_at,
  }: NewUser) {
    try {
      return await this.database
        .insert(users)
        .values({
          username,
          email,
          password_hash: await hash(password_hash, 10),
          access_token,
          access_token_expires_at,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          access_token: users.access_token,
        })
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async getById(id: string) {
    try {
      return await this.database
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.database
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: string,
    {
      username,
      email,
      access_token,
      access_token_expires_at,
    }: Partial<NewUser>,
  ) {
    try {
      return await this.database
        .update(users)
        .set({ username, email, access_token, access_token_expires_at })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          access_token: users.access_token,
        })
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async changePassword(id: string, new_password: string, old_password: string) {
    try {
      const user = await this.getById(id);

      const matched = await compare(old_password, user.password_hash);
      if (!matched) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return await this.database
        .update(users)
        .set({ password_hash: await hash(new_password, 10) })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          access_token: users.access_token,
        })
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string) {
    try {
      return await this.database
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }
}

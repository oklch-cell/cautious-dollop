import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { users } from '../../database/schema.js';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { NewUser } from '../../database/schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly database: PostgresJsDatabase,
  ) {}

  async create({ username, email, password_hash }: NewUser) {
    return await this.database
      .insert(users)
      .values({ username, email, password_hash: await hash(password_hash, 10) })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        access_token: users.access_token,
      })
      .then((row) => row[0]);
  }

  async getById(id: string) {
    return this.database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((row) => row[0]);
  }

  async getByEmail(email: string) {
    return this.database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((row) => row[0]);
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
    return this.database
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
  }

  async changePassword(id: string, new_password: string, old_password: string) {
    return this.database
      .update(users)
      .set({ password_hash: await hash(new_password, 10) })
      .where(
        eq(users.id, id) &&
          eq(users.password_hash, await hash(old_password, 10)),
      )
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        access_token: users.access_token,
      })
      .then((row) => row[0]);
  }

  async delete(id: string) {
    return this.database
      .delete(users)
      .where(eq(users.id, id))
      .returning()
      .then((row) => row[0]);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
// import { sessions } from '../../database/schema.js';
import { eq, lt } from 'drizzle-orm';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @InjectDrizzle()
    private readonly database: PostgresJsDatabase,
  ) {}

  // async get(id: string, token: string) {
  //   return await this.database
  //     .select()
  //     .from(sessions)
  //     .where(
  //       eq(sessions.user_id, id) &&
  //         eq(sessions.access_token, token) &&
  //         lt(sessions.expires_at, new Date(Date.now()).toISOString()),
  //     )
  //     .limit(1)
  //     .then((row) => row[0]);
  // }

  // async create(id: string) {
  //   const access_token = randomBytes(64).toString('hex');

  //   await this.database.delete(sessions).where(eq(sessions.user_id, id));

  //   return await this.database
  //     .insert(sessions)
  //     .values({
  //       access_token,
  //       user_id: id,
  //       expires_at: new Date(Date.now() + 12 * 60 * 60).toISOString(),
  //     })
  //     .returning()
  //     .then((row) => row[0]);
  // }

  // async update(id: string) {}

  // async delete(id: string) {
  //   return await this.database
  //     .delete(sessions)
  //     .where(eq(sessions.user_id, id))
  //     .returning()
  //     .then((row) => row[0]);
  // }
}

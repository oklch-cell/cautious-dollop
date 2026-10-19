import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { messages } from '../../database/schema.js';
import { eq } from 'drizzle-orm';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { NewMessage } from '../../database/schema.js';

@Injectable()
export class MessageService {
  constructor(
    @InjectDrizzle()
    private readonly database: PostgresJsDatabase,
  ) {}

  async create({ content, sender, group }: NewMessage) {
    return this.database
      .insert(messages)
      .values({ content, sender, group })
      .returning()
      .then((row) => row[0]);
  }

  async getAll(group: string) {
    return this.database
      .select()
      .from(messages)
      .where(eq(messages.group, group));
  }

  async delete(id: string) {
    return this.database
      .delete(messages)
      .where(eq(messages.id, id))
      .returning()
      .then((row) => row[0]);
  }
}

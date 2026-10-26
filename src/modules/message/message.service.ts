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
    try {
      return this.database
        .insert(messages)
        .values({ content, sender, group })
        .returning()
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }

  async getAll(group: string) {
    try {
      return this.database
        .select({
          text: messages.content,
          sender: messages.sender,
        })
        .from(messages)
        .where(eq(messages.group, group));
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string) {
    try {
      return this.database
        .delete(messages)
        .where(eq(messages.id, id))
        .returning()
        .then((row) => row[0]);
    } catch (e) {
      throw e;
    }
  }
}

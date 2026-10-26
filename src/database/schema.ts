import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: text().notNull(),
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
  access_token: text(),
  access_token_expires_at: varchar(),
});

export const messages = pgTable('messages', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  content: text().notNull(),
  sender: varchar({ length: 255 })
    .notNull()
    .references(() => users.username, { onDelete: "cascade" }),
  group: varchar({ length: 32 }).notNull(),
  created_at: timestamp({ withTimezone: true, mode: 'string' }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

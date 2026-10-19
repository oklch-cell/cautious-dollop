import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: text().notNull(),
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  content: text().notNull(),
  sender: varchar({ length: 255 })
    .notNull()
    .references(() => users.username),
  group: varchar({ length: 32 }).notNull(),
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  access_token: text().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id),
  expires_at: timestamp({ mode: 'string' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

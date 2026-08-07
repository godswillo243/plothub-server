import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const reservedUsernames = pgTable('reserved_usernames', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull(),
  reason: text('reason'),
  reservedAt: timestamp('reserved_at', { mode: 'date' }).defaultNow(),
});

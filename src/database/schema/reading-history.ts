import { pgTable, uuid, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { chapters } from './chapters';

export const readingHistory = pgTable(
  'reading_history',
  {
    userId: uuid('user_id').references(() => users.id),
    chapterId: uuid('chapter_id').references(() => chapters.id),
    lastReadAt: timestamp('last_read_at', { mode: 'date' }).notNull(),
    progress: integer('progress').default(0),
  },
  (table) => [primaryKey({ columns: [table.userId, table.chapterId] })],
);

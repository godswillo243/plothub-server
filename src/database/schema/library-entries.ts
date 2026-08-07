import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { novels } from './novels';

export const libraryEntries = pgTable(
  'library_entries',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    novelId: uuid('novel_id')
      .notNull()
      .references(() => novels.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.novelId, table.userId] })],
);

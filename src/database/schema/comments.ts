import { uuid, text, timestamp, pgTable, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { chapters } from './chapters';

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    chapterId: uuid('chapter_id')
      .notNull()
      .references(() => chapters.id, { onDelete: 'cascade' }),

    parentId: uuid('parent_id')
      .notNull()
      .references((): any => comments.id, { onDelete: 'cascade' }),
    content: text('content'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('comments_chapter_idx').on(table.chapterId)],
);

import { uuid, text, timestamp, pgTable, integer, uniqueIndex, check } from 'drizzle-orm/pg-core';
import { users } from './users';
import { novels } from './novels';
import { sql } from 'drizzle-orm';

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    novelId: uuid('novel_id')
      .notNull()
      .references(() => novels.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    content: text('content'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('reviews_novel_user_idx').on(table.novelId, table.userId),
    check('reviews_rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ],
);

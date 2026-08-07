import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { novels } from './novels';

export const chapters = pgTable(
  'chapters',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    novelId: uuid('novel_id')
      .notNull()
      .references(() => novels.id),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: text('content').notNull(),
    chapterNumber: integer('chapter_number').notNull(),
    wordCount: integer('word_count').notNull(),
    isPremium: boolean('is_premium').default(false),
    coinPrice: integer('coin_price').default(0),
    publishedAt: timestamp('published_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('chapters_novel_chapter_number_idx').on(table.novelId, table.chapterNumber),
  ],
);

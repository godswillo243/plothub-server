import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { novelStatusEnum, novelVisibilityEnum } from './enums';

export const novels = pgTable(
  'novels',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    coverUrl: text('cover_url'),
    status: novelStatusEnum('status').default('draft').notNull(),
    visibility: novelVisibilityEnum('visibility').default('public').notNull(),
    viewCount: integer('view_count').default(0),
    chapterCount: integer('chapter_count').default(0).notNull(),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    publisedAt: timestamp('published_at', { mode: 'date' }),
  },
  (table) => [
    index('novels_author_idx').on(table.authorId),
    index('novels_slug_idx').on(table.slug),
  ],
);

import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const genres = pgTable(
  'genres',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 60 }).notNull(),
    slug: varchar('slug', { length: 60 }).notNull(),
    description: text('description'),
  },
  (table) => [uniqueIndex('genres_slug_idx').on(table.slug)],
);

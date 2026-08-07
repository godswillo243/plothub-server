import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { novels } from './novels';
import { genres } from './genres';

export const novelGenres = pgTable(
  'novel_genres',
  {
    novelId: uuid('novel_id')
      .notNull()
      .references(() => novels.id, { onDelete: 'cascade' }),
    genreId: uuid('genre_id')
      .notNull()
      .references(() => genres.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.novelId, table.genreId] })],
);

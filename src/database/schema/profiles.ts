import { pgTable, boolean, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const profiles = pgTable('profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  username: varchar('username', { length: 100 }).notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  country: varchar('country', { length: 50 }),
  isWriter: boolean('is_writer').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

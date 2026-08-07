import { pgTable, varchar, uuid, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { usersRoleEnum, userStatusEnum } from './enums';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 30 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    emailVerifiedAt: timestamp('email_verified_at', {
      mode: 'date',
    }),
    role: usersRoleEnum('role').default('user'),
    status: userStatusEnum('status').default('active'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    uniqueIndex('users_username_idx').on(table.username),
  ],
);

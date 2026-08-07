import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { authSessionsClientTypeEnum } from './enums';

export const authSessions = pgTable(
  'auth_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    jti: varchar('jti', { length: 255 }).notNull(),
    refreshTokenHash: varchar('refresh_token_hash', { length: 64 }).notNull(),
    clientType: authSessionsClientTypeEnum('client_type').notNull(),
    deviceId: varchar('device_id', { length: 255 }),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    revokedAt: timestamp('revoked_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
  },
  (table) => [
    index('auth_sessions_user_idx').on(table.userId),
    uniqueIndex('auth_sessions_jti_idx').on(table.jti),
    index('auth_sessions_device_idx').on(table.userId, table.deviceId),
    index('auth_sessions_expires_idx').on(table.expiresAt),
  ],
);

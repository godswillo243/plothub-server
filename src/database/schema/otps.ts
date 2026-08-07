import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { otpPurposeEnum } from './enums';

export const otps = pgTable('otps', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  purpose: otpPurposeEnum('purpose').notNull(),
  codeHash: varchar('code_hash', { length: 255 }).notNull(),
  attempts: integer('attempts').default(0),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

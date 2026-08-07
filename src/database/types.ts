import { profiles, users, otps, authSessions } from './schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;

export type OtpPurpose = (typeof otps.purpose.enumValues)[number];

export type AuthSession = typeof authSessions.$inferSelect;
export type NewAuthSession = typeof authSessions.$inferInsert;

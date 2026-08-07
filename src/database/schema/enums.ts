import { pgEnum } from 'drizzle-orm/pg-core';

export const authSessionsClientTypeEnum = pgEnum('auth_sessions_client_type', ['web', 'mobile']);

export const novelStatusEnum = pgEnum('novel_status', ['draft', 'archived', 'published']);
export const novelVisibilityEnum = pgEnum('novel_visibility', ['public', 'unlisted', 'private']);

export const otpPurposeEnum = pgEnum('otp_purpose_enum', ['verification', 'password_reset', '2fa']);

export const usersRoleEnum = pgEnum('users_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('users_status', ['active', 'suspended', 'deleted']);

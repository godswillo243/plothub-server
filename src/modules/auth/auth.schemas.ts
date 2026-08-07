import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
  username: z
    .string()
    .trim()
    .min(4, 'Username must be at least 4 characters.')
    .max(30, 'Username must not exceed 30 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores.'),
  password: z
    .string()
    .min(8, 'New password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
});

export const signInSchema = z.object({
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
  password: z.string().min(6),
});

export const verifyEmailSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code.'),
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
});

export const resendVerificationEmailSchema = z.object({
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code.'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email. Please provide a valid email address.').trim().toLowerCase(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters.'),

  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type VerifiyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailInput = z.infer<typeof resendVerificationEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

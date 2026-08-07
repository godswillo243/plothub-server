import { ipKeyGenerator } from 'express-rate-limit';
import { createRateLimit } from '../../middlewares/rate-limit';

export const signUpRateLimit = createRateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 5,
});

export const signInRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req.ip!)}-${(req.body as { email: string }).email.toLowerCase()}`,
  skipSuccessfulRequests: true,
});

export const verifyEmailRateLimit = createRateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => (req.body as { email: string }).email.toLowerCase(),
});

export const resendVerificationEmailRateLimit = createRateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  keyGenerator: (req) => (req.body as { email: string }).email.toLowerCase(),
});

export const refreshTokenRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
});

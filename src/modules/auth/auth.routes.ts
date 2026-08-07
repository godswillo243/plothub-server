import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from './auth.schemas';
import { authController } from '.';
import {
  signUpRateLimit,
  signInRateLimit,
  verifyEmailRateLimit,
  resendVerificationEmailRateLimit,
  refreshTokenRateLimit,
} from './auth.rate-limit';

import { deviceMiddleware } from '../../middlewares/device-id.middleware';
import { clientTypeMiddleware } from '../../middlewares/client-type.middleware';
import { requireAuthMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(deviceMiddleware);
router.use(clientTypeMiddleware);

router.post('/sign-up', signUpRateLimit, validate(signUpSchema), authController.signUp);
router.post('/sign-in', signInRateLimit, validate(signInSchema), authController.signIn);
router.post('/refresh', refreshTokenRateLimit, authController.refreshToken);

router.post(
  '/email/verify',
  verifyEmailRateLimit,
  validate(verifyEmailSchema),
  authController.verifyEmail,
);

router.post(
  '/email/resend',
  resendVerificationEmailRateLimit,
  validate(resendVerificationEmailSchema),
  authController.resendVerificationOtp,
);

router.post('/sign-out', authController.signOut);
router.post('/sign-out-all', authController.signOut);

router.post(
  '/password/change',
  requireAuthMiddleware,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.post('/password/forgot', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/password/reset', validate(resetPasswordSchema), authController.resetPassword);

export default router;

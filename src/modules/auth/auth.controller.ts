import { RequestHandler } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifiyEmailInput,
} from './auth.schemas';
import { env } from '../../config/env';
import { ClientType } from '../../common/constants/client-type';
import { getRefreshToken } from './auth.utils';
import { logger } from '../../config/logger';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signUp: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.authService.signUp(req.body as SignUpInput);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
  signIn: RequestHandler = async (req, res, next) => {
    try {
      const data = await this.authService.signIn({
        data: req.body as SignInInput,
        clientType: req.clientType,
        deviceId: req.deviceId,
      });

      const isWeb = req.clientType === ClientType.WEB;

      if (isWeb) {
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        res.cookie('refresh_token', data.refreshToken, {
          httpOnly: env.NODE_ENV === 'production',
          maxAge: MAX_AGE,
          sameSite: true,
          secure: env.NODE_ENV === 'production',
        });
      }

      res.status(201).json({
        success: true,
        message: 'Sign in successful',
        data: {
          user: data.user,
          accessToken: data.accessToken,
          ...(isWeb ? {} : { refreshToken: data.refreshToken }),
        },
      });
    } catch (error) {
      next(error);
    }
  };
  signOut: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken = getRefreshToken(req);
      await this.authService.signOut(refreshToken);

      if (req.clientType === ClientType.WEB) res.clearCookie('refresh_token');

      res.status(204).json({
        success: true,
        message: 'Signed out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  signOutAll: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken = getRefreshToken(req);
      await this.authService.signOutAll(refreshToken);

      if (req.clientType === ClientType.WEB) res.clearCookie('refresh_token');

      res.status(204).json({
        success: true,
        message: 'Signed out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken = getRefreshToken(req);
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      const isWeb = req.clientType === ClientType.WEB;

      if (isWeb) {
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        res.cookie('refresh_token', newRefreshToken, {
          httpOnly: env.NODE_ENV === 'production',
          maxAge: MAX_AGE,
          sameSite: true,
          secure: env.NODE_ENV === 'production',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken, ...(isWeb ? {} : { refreshToken }) },
      });
    } catch (error) {
      next(error);
    }
  };
  verifyEmail: RequestHandler = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.verifyEmail({
        data: req.body as VerifiyEmailInput,
        clientType: req.clientType,
        deviceId: req.deviceId,
      });
      const isWeb = req.clientType === ClientType.WEB;

      if (isWeb) {
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        res.cookie('refresh_token', refreshToken, {
          httpOnly: env.NODE_ENV === 'production',
          maxAge: MAX_AGE,
          sameSite: true,
          secure: env.NODE_ENV === 'production',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Email verified successfully!',
        data: { user, accessToken, ...(isWeb ? {} : { refreshToken }) },
      });
    } catch (error) {
      next(error);
    }
  };
  resendVerificationOtp: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.resendVerificationEmail(req.body as ResendVerificationEmailInput);

      res.status(201).json({
        success: true,
        message: 'Verification otp resent!',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.forgotPassword(req.body as ForgotPasswordInput);

      res.status(201).json({
        success: true,
        message: 'Check your email for reset password code',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };
  resetPassword: RequestHandler = async (req, res, next) => {
    try {
      await this.authService.resetPassword(req.body as ResetPasswordInput);

      res.status(201).json({
        success: true,
        message: 'Password reset successfully!',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };
  changePassword: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.auth?.sub as string;
      logger.info(userId);
      const { message } = await this.authService.changePassword(
        userId,
        req.body as ChangePasswordInput,
      );

      res.status(201).json({
        success: true,
        message,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };
}

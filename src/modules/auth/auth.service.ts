import { AppError } from '../../common/errors/app-error';
import { generateOTP } from '../../common/utils/generate-otp';
import { UserRepository } from '../../database/repository/user.repository';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifiyEmailInput,
} from './auth.schemas';
import { OtpRepository } from '../../database/repository/otp.repository';
import { EmailService } from '../mail/email.service';
import { logger } from '../../config/logger';
import { AuthSerializers } from './auth.serializers';
import { JwtService, type RefreshTokenPayload } from '../../common/jwt/jwt.service';
import { AuthSessionService } from '../auth-sessions/auth-session.service';
import { compareHash, generateRandomToken, hashText } from './auth.utils';
import { db } from '../../database';
import { User } from '../../database/types';
import { ClientType } from '../../common/constants/client-type';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OtpRepository,
    private emailService: EmailService,
    private authSessionService: AuthSessionService,
  ) {}

  async signUp(data: SignUpInput) {
    const { email, username, password } = data;

    const [existingUser, existingUsername] = await Promise.all([
      this.userRepository.existsByEmail(email),
      this.userRepository.existsByUsername(username),
    ]);
    if (existingUser) {
      throw new AppError('Email already used.', 409);
    }
    if (existingUsername) {
      throw new AppError('Username already used. Please enter a different username.', 409);
    }

    const otp = generateOTP(6);

    const [passwordHash, otpHash] = await Promise.all([hashText(password), hashText(otp, 10)]);

    let user: User | null = null;

    await db.transaction(async (tx) => {
      const userRepository = new UserRepository(tx as unknown as typeof db);
      const otpRepository = new OtpRepository(tx as unknown as typeof db);
      user = await userRepository.create({ email, username, passwordHash });
      await otpRepository.deleteByEmailAndPurpose(email, 'verification');
      await otpRepository.create({
        email,
        codeHash: otpHash,
        purpose: 'verification',
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      });
    });

    if (!user) {
      throw new AppError('Failed to create user.', 500);
    }

    try {
      await this.emailService.sendVerificationEmail(email, username, otp);
    } catch (error) {
      logger.error(error, 'Failed to send verification email.');
    }

    return AuthSerializers.serializeUser(user);
  }

  async verifyEmail({
    clientType,
    data,
    deviceId,
  }: {
    data: VerifiyEmailInput;
    clientType: ClientType;
    deviceId: string;
  }) {
    const { email, otp } = data;
    const otpRecord = await this.otpRepository.findByEmailAndPurpose(email, 'verification');
    if (!otpRecord) {
      throw new AppError('Invalid or expired OTP.', 400);
    }

    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const matches = await compareHash(otp, otpRecord.codeHash);
    if (!matches) {
      throw new AppError('Invalid OTP.', 400);
    }
    const userId = user.id;
    await db.transaction(async (tx) => {
      const userRepository = new UserRepository(tx as unknown as typeof db);
      const otpRepository = new OtpRepository(tx as unknown as typeof db);

      await otpRepository.deleteByEmailAndPurpose(email, 'verification');
      user = await userRepository.update(userId, { emailVerifiedAt: new Date() });
    });

    if (user && user.emailVerifiedAt) {
      await this.emailService.sendVerifiedEmail(email, user.username);
    }

    const { accessToken, refreshToken } = await this.createAuthSession(
      userId,
      deviceId,
      clientType,
    );

    return {
      accessToken,
      user: AuthSerializers.serializeUser(user),
      refreshToken,
    };
  }

  async signIn({
    clientType,
    data,
    deviceId,
  }: {
    data: SignInInput;
    clientType: ClientType;
    deviceId: string;
  }) {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 400);
    }

    if (!user.emailVerifiedAt) {
      throw new AppError('Email not verified.', 400);
    }

    const matches = await compareHash(password, user.passwordHash!);
    if (!matches) {
      throw new AppError('Invalid email or password.', 400);
    }

    const { accessToken, refreshToken } = await this.createAuthSession(
      user.id,
      deviceId,
      clientType,
    );

    return {
      accessToken,
      user: AuthSerializers.serializeUser(user),
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new AppError('Refresh token is required.', 400);
    }
    let payload: RefreshTokenPayload;
    try {
      payload = JwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token.', 400);
    }
    const session = await this.authSessionService.verifySession({ jti: payload.jti, refreshToken });
    if (!session) {
      throw new AppError('Invalid refresh token.', 400);
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.createAuthSession(
      payload.sub,
      session.deviceId!,
      session.clientType as ClientType,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async resendVerificationEmail(data: ResendVerificationEmailInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.emailVerifiedAt) {
      throw new AppError('Email already verified.', 400);
    }

    const otp = generateOTP(6);

    const otpHash = await hashText(otp, 10);

    await this.otpRepository.deleteByEmailAndPurpose(data.email, 'verification');
    await this.otpRepository.create({
      email: data.email,
      codeHash: otpHash,
      purpose: 'verification',
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    });
    await this.emailService.sendVerificationEmail(data.email, user.username, otp);

    return { message: 'Verification email sent.' };
  }

  async signOut(refreshToken: string | undefined) {
    if (!refreshToken) {
      return { message: 'No session found.' };
    }

    let payload: RefreshTokenPayload;

    try {
      payload = JwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token.', 401);
    }

    try {
      const session = await this.authSessionService.verifySession({
        jti: payload.jti,
        refreshToken,
      });

      await this.authSessionService.logout(session.id);
    } catch (error) {
      if (error instanceof AppError) {
        return;
      }

      throw error;
    }
  }
  async signOutAll(refreshToken: string | undefined) {
    if (!refreshToken) {
      return { message: 'No session found.' };
    }

    let payload: RefreshTokenPayload;

    try {
      payload = JwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token.', 401);
    }

    try {
      await this.authSessionService.verifySession({
        jti: payload.jti,
        refreshToken,
      });

      await this.authSessionService.logoutAll(payload.sub);
    } catch (error) {
      if (error instanceof AppError) {
        return;
      }

      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const otp = generateOTP();
    const codeHash = await hashText(otp);

    await this.otpRepository.deleteByEmailAndPurpose(email, 'password_reset');

    await this.otpRepository.create({
      email,
      codeHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      purpose: 'password_reset',
    });

    await this.emailService.sendPasswordResetEmail(user.email, user.username, otp);
  }

  async resetPassword(data: ResetPasswordInput) {
    const { otp, newPassword, email } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    const otpRecord = await this.otpRepository.findByEmailAndPurpose(email, 'password_reset');
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired OTP.', 400);
    }

    if (otpRecord.attempts! >= 5) {
      throw new AppError('Too many attempts. Request another code.', 429);
    }

    const matches = await compareHash(otp, otpRecord.codeHash);
    if (!matches) {
      throw new AppError('Invalid or expired OTP.', 400);
    }

    await this.otpRepository.incrementAttempts(otpRecord.id);

    const newPasswordHash = await hashText(newPassword);
    await db.transaction(async (tx) => {
      const userRepository = new UserRepository(tx as unknown as typeof db);

      const otpRepository = new OtpRepository(tx as unknown as typeof db);

      await userRepository.update(user.id, {
        passwordHash: newPasswordHash,
      });

      await otpRepository.delete(otpRecord.id);
    });
    await this.authSessionService.logoutAll(user.id);

    try {
      await this.emailService.sendPasswordResetSuccessEmail(email, user.username);
    } catch (err) {
      logger.error({ err }, 'error sending email ');
    }
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isValid = await compareHash(data.currentPassword, user.passwordHash!);

    if (!isValid) {
      throw new AppError('Current password is incorrect.', 400);
    }

    const passwordHash = await hashText(data.newPassword);

    await this.userRepository.update(user.id, {
      passwordHash,
    });

    await this.authSessionService.logoutAll(user.id);

    return {
      message: 'Password changed successfully.',
    };
  }

  private async createAuthSession(userId: string, deviceId: string, clientType: ClientType) {
    const jti = generateRandomToken();

    const accessToken = JwtService.generateAccessToken(userId);

    const refreshToken = JwtService.generateRefreshToken({
      jti,
      userId,
    });

    await this.authSessionService.createOrUpdateSession({
      userId,
      deviceId,
      clientType,
      jti,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

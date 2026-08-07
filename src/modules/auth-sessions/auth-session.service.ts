import { ClientType } from '../../common/constants/client-type';
import { REFRESH_TOKEN_HASH_ROUNDS, AUTH_SESSION_TTL } from '../../common/constants/tokens';
import { AppError } from '../../common/errors/app-error';
import { AuthSessionRepository } from '../../database/repository/auth-session.repository';
import bcrypt from 'bcrypt';
import { AuthSession } from '../../database/types';

export class AuthSessionService {
  constructor(private readonly authSessionRepository: AuthSessionRepository) {}
  async createOrUpdateSession({
    deviceId,
    jti,
    refreshToken,
    userId,
    clientType,
  }: {
    deviceId: string;
    jti: string;
    refreshToken: string;
    userId: string;
    clientType: ClientType;
  }) {
    const refreshTokenHash = await this.hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + AUTH_SESSION_TTL);

    const existingSession = await this.authSessionRepository.findByUserIdAndDeviceId(
      userId,
      deviceId,
    );

    if (existingSession) {
      const updatedSession = await this.authSessionRepository.update(existingSession.id, {
        jti,
        refreshTokenHash,
        expiresAt,
      });
      return updatedSession;
    }

    const session = await this.authSessionRepository.create({
      clientType,
      expiresAt,
      jti,
      refreshTokenHash,
      userId,
      deviceId,
    });
    return session;
  }

  async rotateSession({
    session,
    jti,
    refreshToken,
  }: {
    session: AuthSession;
    jti: string;
    refreshToken: string;
    previousRefreshToken: string;
  }) {
    const expiresAt = new Date(Date.now() + AUTH_SESSION_TTL);
    const refreshTokenHash = await this.hashRefreshToken(refreshToken);

    const updatedSession = await this.authSessionRepository.update(session.id, {
      jti,
      refreshTokenHash,
      expiresAt,
    });

    return updatedSession;
  }

  async verifySession({ jti, refreshToken }: { jti: string; refreshToken: string }) {
    const session = await this.authSessionRepository.findByJti(jti);

    if (!session) {
      throw new AppError('Session not found.', 401);
    }

    if (session.expiresAt < new Date()) {
      await this.authSessionRepository.delete(session.id);
      throw new AppError('Session has been expired.', 401);
    }

    if (session.revokedAt) {
      throw new AppError('Session revoked.', 401);
    }

    const matches = await bcrypt.compare(refreshToken, session.refreshTokenHash);

    if (!matches) {
      throw new AppError('Invalid refresh token.', 401);
    }

    return session;
  }

  async logout(sessionId: string) {
    await this.authSessionRepository.delete(sessionId);
  }

  async logoutAll(userId: string) {
    await this.authSessionRepository.deleteByUserId(userId);
  }

  async cleanupExpiredSessions() {
    await this.authSessionRepository.deleteExpired();
  }

  private async hashRefreshToken(token: string) {
    return bcrypt.hash(token, REFRESH_TOKEN_HASH_ROUNDS);
  }
}

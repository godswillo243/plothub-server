import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { type StringValue } from 'ms';
export interface JwtPayload {
  sub: string;
  role?: 'USER' | 'ADMIN';
}

export type RefreshTokenPayload = JwtPayload & {
  jti: string;
};

export class JwtService {
  static generateAccessToken(userId: string, role?: 'USER' | 'ADMIN') {
    return jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
    });
  }

  static generateRefreshToken({
    jti,
    userId,
    role,
  }: {
    userId: string;
    jti: string;
    role?: 'USER' | 'ADMIN';
  }) {
    return jwt.sign({ sub: userId, jti, role }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue,
    });
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }
}

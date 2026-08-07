import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request } from 'express';
import { ClientType } from '../../common/constants/client-type';

export function generateOTP(length: number = 6): string {
  const otp = Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1));
  return otp.toString();
}

export function hashText(text: string, saltRounds: number = 12): Promise<string> {
  return bcrypt.hash(text, saltRounds);
}

export function compareHash(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
export function getRefreshToken(req: Request) {
  if (req.clientType === ClientType.WEB) {
    return req.cookies['refresh_token'] as string;
  }

  return req.headers.authorization?.replace('Bearer ', '');
}

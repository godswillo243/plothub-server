import { BaseRepository } from './base.repository';
import { db, otps } from '..';
import { and, eq, lt, sql } from 'drizzle-orm';
import { NewOtp, Otp, OtpPurpose } from '../types';

export class OtpRepository extends BaseRepository {
  constructor(database = db) {
    super(database);
  }

  async create(data: NewOtp): Promise<Otp> {
    const [otp] = await this.database.insert(otps).values(data).returning();

    if (!otp) {
      throw new Error('Failed to create OTP.');
    }

    return otp;
  }

  async findByEmailAndPurpose(email: string, purpose: OtpPurpose): Promise<Otp | null> {
    const [otp] = await this.database
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), eq(otps.purpose, purpose)));

    return otp ?? null;
  }

  async incrementAttempts(otpId: string): Promise<void> {
    await this.database
      .update(otps)
      .set({ attempts: sql`${otps.attempts} + 1` })
      .where(eq(otps.id, otpId));
  }

  async deleteByEmailAndPurpose(email: string, purpose: OtpPurpose): Promise<void> {
    await this.database.delete(otps).where(and(eq(otps.email, email), eq(otps.purpose, purpose)));
  }

  async deleteExpired(): Promise<void> {
    await this.database.delete(otps).where(lt(otps.expiresAt, new Date()));
  }

  async delete(otpId: string): Promise<void> {
    await this.database.delete(otps).where(eq(otps.id, otpId));
  }
}

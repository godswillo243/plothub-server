import { BaseRepository } from './base.repository';
import { db, authSessions } from '..';
import { and, eq, gt, isNull, lt } from 'drizzle-orm';
import { AuthSession, NewAuthSession } from '../types';

export class AuthSessionRepository extends BaseRepository {
  constructor(database = db) {
    super(database);
  }

  async create(data: NewAuthSession): Promise<AuthSession> {
    const [session] = await this.database.insert(authSessions).values(data).returning();

    if (!session) {
      throw new Error('Failed to create auth session.');
    }

    return session;
  }

  async update(id: string, data: Partial<NewAuthSession>): Promise<AuthSession | null> {
    const [session] = await this.database
      .update(authSessions)
      .set(data)
      .where(eq(authSessions.id, id))
      .returning();

    return session ?? null;
  }

  async findById(id: string): Promise<AuthSession | null> {
    const session = await this.database.query.authSessions.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return session ?? null;
  }

  async findByJti(jti: string): Promise<AuthSession | null> {
    const session = await this.database.query.authSessions.findFirst({
      where: (table, { eq }) => eq(table.jti, jti),
    });

    return session ?? null;
  }

  async findByUserId(userId: string): Promise<AuthSession[]> {
    const sessions = await this.database
      .select()
      .from(authSessions)
      .where(eq(authSessions.userId, userId));

    return sessions;
  }
  async findActiveByUserId(userId: string): Promise<AuthSession[]> {
    const session = await this.database
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.userId, userId),
          isNull(authSessions.revokedAt),
          gt(authSessions.expiresAt, new Date()),
        ),
      );
    return session;
  }

  async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<AuthSession | null> {
    const [session] = await this.database
      .select()
      .from(authSessions)
      .where(and(eq(authSessions.userId, userId), eq(authSessions.deviceId, deviceId)));

    return session ?? null;
  }

  async revoke(id: string): Promise<void> {
    await this.database
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.id, id));
  }

  async revokeAll(userId: string): Promise<void> {
    await this.database
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.userId, userId));
  }

  async deleteExpired(): Promise<void> {
    await this.database.delete(authSessions).where(lt(authSessions.expiresAt, new Date()));
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(authSessions).where(eq(authSessions.id, id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.database.delete(authSessions).where(eq(authSessions.userId, userId));
  }
}

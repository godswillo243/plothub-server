import { and, eq } from 'drizzle-orm';
import { db, profiles } from '..';
import { BaseRepository } from './base.repository';
import { NewProfile, Profile } from '../types';

export class ProfileRepository extends BaseRepository {
  constructor(database = db) {
    super(database);
  }

  async create(data: NewProfile): Promise<Profile | null> {
    const [profile] = await this.database.insert(profiles).values(data).returning();

    return profile ?? null;
  }

  async update(userId: string, data: Partial<NewProfile>): Promise<Profile | null> {
    const [profile] = await this.database
      .update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning();

    return profile ?? null;
  }

  async findByUserId(userId: string) {
    const [profile] = await this.database
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    return profile ?? null;
  }

  async findByUsername(username: string) {
    const [profile] = await this.database
      .select()
      .from(profiles)
      .where(and(eq(profiles.username, username)));
    return profile ?? null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const profile = await this.findByUsername(username);
    return !!profile;
  }

  async delete(userId: string) {
    const [profile] = await this.database
      .delete(profiles)
      .where(eq(profiles.userId, userId))
      .returning();

    return profile ?? null;
  }
}

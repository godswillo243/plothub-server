import { BaseRepository } from './base.repository';
import { NewUser, User } from '../types';
import { db, users } from '..';
import { and, eq, isNull } from 'drizzle-orm';

export class UserRepository extends BaseRepository {
  constructor(database = db) {
    super(database);
  }

  async create(data: NewUser): Promise<User | null> {
    const [user] = await this.database.insert(users).values(data).returning();

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const [user] = await this.database.update(users).set(data).where(eq(users.id, id)).returning();

    return user ?? null;
  }

  async findById(id: string) {
    const [user] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));

    return user ?? null;
  }

  async findByUsername(username: string) {
    const [user] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.username, username)));
    return user ?? null;
  }

  async findByEmail(email: string) {
    const [user] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.email, email)));
    return user ?? null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return !!user;
  }

  async delete(id: string): Promise<User | null> {
    const [user] = await this.database.delete(users).where(eq(users.id, id)).returning();
    return user ?? null;
  }
}

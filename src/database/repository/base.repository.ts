import { db } from '..';

export abstract class BaseRepository {
  protected constructor(protected readonly database = db) {}
}

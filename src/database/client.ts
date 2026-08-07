// src/database/client.ts

import postgres from 'postgres';
import { env } from '../config/env';

export const client = postgres(env.DATABASE_URL);

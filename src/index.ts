import { sql } from 'drizzle-orm';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { db } from './database';

const PORT = env.PORT || 3000;

(async () => {
  await db.execute(sql`SELECT 1`);
  console.log('\nDatabase connected');
  app.listen(PORT, () => {
    logger.info(`🚀 PlotHub API running on port ${PORT}\n`);
  });
})().catch((e) => {
  logger.error({ message: 'Failed to connect to database', error: e });
  process.exit(1);
});

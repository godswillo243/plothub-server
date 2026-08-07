import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  NODE_ENV: z.string().optional(),
  PORT: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().nonempty(),
  JWT_REFRESH_SECRET: z.string().nonempty(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().nonempty(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().nonempty(),
  CORS_ORIGIN: z.string().optional(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_SERVICE: z.string(),
  SMTP_FROM: z.string(),
});

export const env = envSchema.parse(process.env);

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import authRouter from './modules/auth/auth.routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorMiddleware);
export default app;

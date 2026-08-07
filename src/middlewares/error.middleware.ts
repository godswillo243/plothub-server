import { type ErrorRequestHandler } from 'express';

import { logger } from '../config/logger';
import { AppError } from '../common/errors/app-error';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(
    {
      err,
    },
    '\nUnhandled application error',
  );

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

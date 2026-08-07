import { ZodObject, ZodError } from 'zod';

import { RequestHandler } from 'express';

import { AppError } from '../common/errors/app-error';

export const validate =
  (schema: ZodObject): RequestHandler =>
  async (req, _res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError(error.issues[0]?.message ?? 'Validation failed', 400));
      }

      next(error);
    }
  };

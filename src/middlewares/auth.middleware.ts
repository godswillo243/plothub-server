import { NextFunction, Request, Response } from 'express';
import { AppError } from '../common/errors/app-error';
import { JwtService } from '../common/jwt/jwt.service';
import { logger } from '../config/logger';

function getAccessToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export const requireAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return next(new AppError('Access token is required.', 401));
  }
  try {
    const payload = JwtService.verifyAccessToken(accessToken);
    req.auth = payload;
    next();
  } catch (error) {
    logger.warn(
      {
        error,
        ip: req.ip,
        path: req.originalUrl,
      },
      '\nInvalid access token',
    );
    next(new AppError('Invalid access token', 401));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const accessToken = getAccessToken(req);

  if (accessToken) {
    try {
      const payload = JwtService.verifyAccessToken(accessToken);
      req.auth = payload;
    } catch (error) {
      logger.debug({ error }, 'Ignoring invalid access token');
    }
  }

  next();
};

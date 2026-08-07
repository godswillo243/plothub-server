import { randomUUID } from 'node:crypto';
import { type NextFunction, type Request, type Response } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
}

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/app-error';
import { DEVICE_ID_HEADER } from '../common/constants/header-keys';

export function deviceMiddleware(req: Request, _res: Response, next: NextFunction) {
  const deviceId = req.headers[DEVICE_ID_HEADER];

  if (!deviceId || typeof deviceId !== 'string') {
    throw new AppError('Device ID is required.', 400);
  }

  req.deviceId = deviceId;

  next();
}

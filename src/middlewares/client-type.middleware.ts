import { NextFunction, Request, Response } from 'express';
import { CLIENT_TYPE_HEADER, ClientType } from '../common/constants/client-type';
import { AppError } from '../common/errors/app-error';

export const clientTypeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientType = req.header(CLIENT_TYPE_HEADER) as ClientType;

  if (clientType !== ClientType.WEB && clientType !== ClientType.MOBILE) {
    next(new AppError('Invalid client type.', 400));
  }
  req.clientType = clientType;
  next();
};

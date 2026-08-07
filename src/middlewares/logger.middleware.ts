import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

export const loggerMiddleware = pinoHttp({
  logger,

  autoLogging: true,

  customSuccessMessage(req, res) {
    return `\n${req.method} ${req.url} completed with ${res.statusCode}\n`;
  },

  customErrorMessage(req, res) {
    return `\n${req.method} ${req.url} failed with ${res.statusCode}\n`;
  },
  serializers: {
    req: () => {
      return;
    },
    res: () => {
      return;
    },
  },
});

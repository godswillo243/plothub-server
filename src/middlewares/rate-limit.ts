import rateLimit, { ipKeyGenerator, type Options } from 'express-rate-limit';

export function createRateLimit(options: Partial<Options>) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator(req) {
      return ipKeyGenerator(req.ip ?? ''); // better
    },

    handler(req, res) {
      req.log.warn(
        {
          ip: req.ip,
          route: req.originalUrl,
        },
        'Rate limit exceeded',
      );

      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
        },
      });
    },

    ...options,
  });
}
/*

| Endpoint                         |            Limit | Why                         |
| -------------------------------- | ---------------: | --------------------------- |
| `POST /auth/sign-up`             |        5/hour/IP | Stop account creation spam  |
| `POST /auth/sign-in`             | 5/min/IP + email | Stop password guessing      |
| `POST /auth/verify-email`        |    10/hour/email | Prevent OTP brute force     |
| `POST /auth/resend-verification` |    3/10min/email | Prevent email spam          |
| `POST /auth/forgot-password`     |     3/hour/email | Prevent abuse               |
| `POST /auth/reset-password`      |           5/hour | Prevent brute force         |
| `POST /auth/refresh`             |   30/min/session | Prevent refresh token abuse |


*/

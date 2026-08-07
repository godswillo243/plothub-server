import { ClientType } from '../common/constants/client-type';
import { JwtPayload } from '../common/jwt/jwt.service';

declare global {
  namespace Express {
    interface Request {
      clientType: ClientType;
      deviceId: string;
      auth?: JwtPayload;
    }
  }
}

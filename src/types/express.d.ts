import { Request } from 'express';
import { UserPayload } from './user';
import { ApiKeyWithUser } from 'src/modules/api-key/api-key.service';
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      apiKey?: ApiKeyWithUser;

    }
  }
}

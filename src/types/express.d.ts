// src/types/express.d.ts
import { Request } from 'express';
import { UserPayload } from './user';
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Extend with your UserPayload type
    }
  }
}

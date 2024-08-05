import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AfterResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware before handler execution');

    res.on('finish', () => {
      console.log('Response has been sent, running post-response logic');
    });

    next(); 
  }
}


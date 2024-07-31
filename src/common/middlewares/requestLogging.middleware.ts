import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, ip, body, query, params } = req;
    const userAgent = headers['user-agent'] || '';
    const reqHost = headers.host || '';

    // Log basic request information
    this.logger.info('Incoming request', {
      reqHost,
      method,
      url,
      ip,
      userAgent,
      body: JSON.stringify(body),
      query: JSON.stringify(query),
      params: JSON.stringify(params),
    });

    // Proceed to next middleware or route handler
    next();
  }
}

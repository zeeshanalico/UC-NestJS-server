import { Injectable } from '@nestjs/common';
import { logger } from './logger.config';

@Injectable()
export class LoggerService {
  info(message: string, meta?: Record<string, any>) {
    logger.info(message, meta);
  }

  error(message: string, trace: string, meta?: Record<string, any>) {
    logger.error(message, { trace, ...meta });
  }

  warn(message: string, meta?: Record<string, any>) {
    logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>) {
    logger.debug(message, meta);
  }
}

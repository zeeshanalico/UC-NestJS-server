import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoggerService } from '../logger.service';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
};
 

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, headers, ip, body, query, params } = req;
    const userAgent = headers['user-agent'] || '';
    const reqHost = headers.host || '';

    const now = Date.now();
    const date = new Date()
    const formattedDate = date.toISOString()

    this.logger.info(`Req | ${method}@${reqHost}${url} `);
    return next.handle().pipe(
      tap(() => {
        // console.log('----tap----');
      }),
      map((res) => {
        // console.log('----map----');
        const { statusCode, data, message = 'responded successfully' } = res;
        this.logger.info(`Res | ${message}`);
        return {
          statusCode,
          data,
          message,
          error: null
        };
      }),
    );
  }
}

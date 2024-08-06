import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../../modules/logger/logger.service';
import { format } from 'date-fns';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { RESPONSE_MESSAGE_METADATA } from 'src/common/decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = {
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result: exception,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    this.logger.error(
      `Error: ${exception.message}`,
      exception.stack,
      `ResponseInterceptor`,
    );

    response.status(status).json(errorMessage);
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'success';

    const responseObject: Response<T> = {
      status: true,
      path: request.url,
      statusCode,
      message,
      data: res,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    this.logger.info(
      `Response: ${JSON.stringify(responseObject ,null, 2)}`,
      `ResponseInterceptor`,
    );

    return responseObject;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    this.logger.info(
      `Request: ${request.method} ${request.url}`,
      `ResponseInterceptor`,
    );

    return next.handle().pipe(
      map((res: unknown) => {
        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }
}

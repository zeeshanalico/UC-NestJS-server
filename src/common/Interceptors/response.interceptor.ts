import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

import { LoggerService } from '../../modules/logger/logger.service';
import { format } from 'date-fns';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { RESPONSE_MESSAGE_METADATA } from 'src/common/decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { IS_IGNORE } from '../decorators/ignoreResponseInterceptor.decorator';

export type ResponseI<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
  data: T;
};

interface ErrorResponse {
  status: boolean;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
  error: string;
}


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseI<T>> {
  constructor(
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) { }

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
      `ResponseInterceptor:errorHandler()`,
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

    const responseObject: ResponseI<T> = {
      status: true,
      path: request.url,
      statusCode,
      message,
      data: res,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    this.logger.info(
      `Response: ${JSON.stringify(responseObject, null, 2)}`,
      `ResponseInterceptor`,
    );

    return responseObject;
  }

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status code
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[];
    let error: string;

    if (isHttpException) {
      const response = exception.getResponse();
      message = (response as any)?.message || exception.message;
      error = (response as any)?.error || exception.name;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {

      switch (exception.code) {
        case 'P2002':
          message = 'Unique constraint failed';
          error = 'DatabaseError';
          break;
        case 'P2025':
          message = 'Record not found';
          error = 'DatabaseError';
          break;
        case 'P1001':
          message = "Can't reach database";
          error = 'DatabaseError';
          break;
          ``
        default:
          message = 'Prisma error occurred';
          error = exception.code;
      }


    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', exception.message);

      message = 'Invalid input data provided.';
      error = 'ValidationError';
    }
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    } else {
      message = 'Internal server error';
      error = 'InternalError';
    }

    const errorResponse: ErrorResponse = {
      status: false,
      statusCode,
      message: Array.isArray(message) ? message : [message],
      error,
      path: request.url,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    this.logger.error(
      `Error ${statusCode}: ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : '',
      'ResponseInterceptor:catch()',
    );
    response.status(statusCode).json(errorResponse);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseI<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    this.logger.info(
      `Request: ${request.method} ${request.url} ${'\nBody:' + JSON.stringify(request.body, null, 2)}`,
      `ResponseInterceptor`,
    );

    const isIgnore = this.reflector.get<string>(
      IS_IGNORE,
      context.getHandler(),
    )


    if (isIgnore) return next.handle();

    return next.handle().pipe(
      map((res: unknown) => {
        if (res)
          return this.responseHandler(res, context);
      }),
      catchError((err: unknown) =>
        throwError(() => this.catch(err, context)),
      ),
    );
  }
}

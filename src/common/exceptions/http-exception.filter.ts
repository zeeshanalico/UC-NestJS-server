import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaClient, Prisma } from '@prisma/client'

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  data: any;
  exception:any;
}

@Catch()
export class HttpExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) { }

  catch(exception: T, host: ArgumentsHost) {  
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

      // console.log('\n______\n',exception instanceof Prisma.PrismaClientKnownRequestError, '\n______\n');

    const isHttpException = exception instanceof HttpException;


    const statusCode = isHttpException
      ? (exception.getStatus() | 500)
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? (exception.getResponse() as any)?.message || exception.message
      : exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const error =
      isHttpException && (exception.getResponse() as any)?.error
        ? (exception.getResponse() as any).error
        : exception instanceof Error
          ? exception.name
          : 'InternalError';

    const errorResponse: ErrorResponse = {
      statusCode,
      // message: Array.isArray(message) ? message : [message],
      message,
      error,
      path: request.url,
      data: null,
      exception
    };

    this.logger.error(
      'Exception thrown',
      exception instanceof Error ? exception.stack : '',
    );

    // Send the response to the client
    response.status(statusCode).json(errorResponse);
  }
}

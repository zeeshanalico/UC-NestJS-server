import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
import { format } from 'date-fns';
import { Prisma } from '@prisma/client'; // Import Prisma errors
import { PrismaException } from './custom-exception';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  status: boolean;
  timestamp: string;
}

@Catch()
export class HttpExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) { }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status code
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
      : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('ZEESHAN',exception);
    
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

        default:
          message = 'Prisma error occurred';
          error = exception.code;
      }

      console.log(message);
      
    } else if (exception instanceof Error) {
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
      'HttpExceptionsFilter',
    );

    response.status(statusCode).json(errorResponse);
  }
}

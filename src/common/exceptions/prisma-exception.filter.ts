// src/common/exceptions/prisma-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { LoggerService } from 'src/modules/logger/logger.service';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {

  constructor(private readonly logger: LoggerService) { }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';    
    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message =
          'Unique constraint failed on the fields: ' +
          exception.meta?.target;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'The provided value is too long for the field';
        break;
      case 'P2014':
        statusCode = HttpStatus.BAD_REQUEST;
        message =
          'The change you are trying to make would violate the required relation between models';
        break;
      case 'P2016':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Query interpretation error';
        case 'P1001':
        statusCode = HttpStatus.BAD_REQUEST;
        message = "Can't reach database server";

        break;
      default:
        break;
    }

    this.logger.error('Prisma error occurred', exception.stack, );

    // Send the response
    response.status(statusCode).json({
      statusCode,
      message,
      error: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

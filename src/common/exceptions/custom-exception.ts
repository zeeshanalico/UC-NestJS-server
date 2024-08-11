// import { HttpException, HttpStatus } from '@nestjs/common';

// export class NotFoundException extends HttpException {//404
//   constructor(message: string, error = 'Not Found') {
//     super(
//       {
//         statusCode: HttpStatus.NOT_FOUND,
//         message,
//         error,
//       },
//       HttpStatus.NOT_FOUND,
//     );
//   }
// }

// export class BadRequestException extends HttpException {//400
//   constructor(message: string, error = 'Bad Request') {
//     super(
//       {
//         statusCode: HttpStatus.BAD_REQUEST,
//         message,
//         error,
//       },
//       HttpStatus.BAD_REQUEST,
//     );
//   }
// }

// export class InternalServerErrorException extends HttpException {//500
//   constructor(message: string, error = 'Internal Server Error') {
//     super(
//       {
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message,
//         error,
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }


import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class PrismaException extends PrismaClientKnownRequestError {
    constructor(message: string, code: any, meta?: any, clientVersion?: string, batchRequestIdx?: number,) {
        super(message, { code, clientVersion: null, batchRequestIdx: null, meta: null })
    };
}
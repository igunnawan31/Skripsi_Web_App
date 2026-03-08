import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response, Request } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';
interface ExceptionResponseObj {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: string | object = 'Internal Server Error';

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorResponse = typeof res === 'string' ? res : res;
    }
    // Any other error
    else if (exception instanceof Error) {
      errorResponse = exception.message;
    }

    const responseObj: ExceptionResponseObj = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: errorResponse,
    };

    // Send response only if not already sent
    if (!response.headersSent) {
      response.status(status).json(responseObj);
    }

    // Safe logging
    const logMessage =
      typeof errorResponse === 'object'
        ? JSON.stringify(errorResponse)
        : errorResponse;

    this.logger.error(logMessage, (exception as Error)?.stack ?? undefined);
  }
}


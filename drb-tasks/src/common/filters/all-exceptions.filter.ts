// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus, // Import HttpStatus
  Logger, // Import Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Catching all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  // Instantiate a logger for this filter
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500

    // Get the error message
    let message: string | object = 'Internal Server Error';

    if (exception instanceof HttpException) {
      // For HttpExceptions, get the response
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : exceptionResponse;
    } else if (exception instanceof Error) {
      // For standard JavaScript errors, use the error message
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    // Log the error
    // For unknown errors, log the full stack trace
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method} ${request.url}] ${status} - Error: ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}`,
      );
    } else {
      // For known errors (HttpExceptions), just log the response
      this.logger.warn(
        `[${request.method} ${request.url}] ${status} - Message: ${JSON.stringify(message)}`,
      );
    }

    // Send the response
    response.status(status).json(errorResponse);
  }
}

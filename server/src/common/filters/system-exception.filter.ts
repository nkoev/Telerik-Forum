import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForumSystemException } from '../exceptions/system-exception';

@Catch()
export class SystemExceptionFilter implements ExceptionFilter {
  catch(exception: ForumSystemException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    response
      .status(exception.status)
      .json({
        statusCode: exception.status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
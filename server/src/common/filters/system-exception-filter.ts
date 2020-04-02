import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ForumSystemException } from '../exceptions/system-exception';


@Catch(ForumSystemException)
export class SystemExceptionFilter implements ExceptionFilter {
  public catch(exception: ForumSystemException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.status).json({
      status: exception.status,
      message: exception.message
    });
  }
}
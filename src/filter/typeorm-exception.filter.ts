import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private logger = new Logger();

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { url, ip } = ctx.getRequest<Request>();
    const status = 500;
    const { message, stack, name } = exception;

    this.logger.error(message, stack, name);
    this.logger.error(`TypeORMError 발생`, ip);

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      message,
    });
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { ip } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => this.logger.log(`걸린시간 : ${Date.now() - now}ms`, ip)),
      map((data) => {
        this.logger.log(`응답 : ${response.statusCode}`, ip);
        return { success: true, statusCode: response.statusCode, data };
      }),
    );
  }
}

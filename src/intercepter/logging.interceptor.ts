import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest<Request>();

    const { ip } = request;

    return next.handle().pipe(
      tap(() => this.logger.log(`걸린시간 : ${Date.now() - now}ms`, ip)),
      map((data) => ({ success: true, data })),
    );
  }
}

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;

    this.logger.log(`요청 : ${originalUrl} ${method}`, ip);

    res.on('finish', () => {
      this.logger.log(`응답 : ${res.statusCode}\n`, ip);
    });

    next();
  }
}

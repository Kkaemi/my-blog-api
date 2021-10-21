import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger();
  const { ip, method, originalUrl } = req;
  console.log('\n');
  logger.log(`${method} 요청 : ${originalUrl}`, ip);
  next();
}

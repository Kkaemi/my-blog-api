import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TypeOrmExceptionFilter } from './filter/typeorm-exception.filter';
import { LoggingInterceptor } from './intercepter/logging.interceptor';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new TypeOrmExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionsFilter } from './common/exceptions/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './modules/logger/logger.service';

(async () => {
  const app = await NestFactory.create(AppModule, {
    
  });
  app.enableCors();
  await app.listen(3001);
})();

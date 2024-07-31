import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';

(async () => {
  const app = await NestFactory.create(AppModule, {
  });
  await app.listen(3000);
})();

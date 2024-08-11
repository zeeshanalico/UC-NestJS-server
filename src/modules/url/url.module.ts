import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';
import { UrlController } from './url.controller';

@Module({
  providers: [UrlService, PrismaService],
  controllers: [UrlController],
  exports:[UrlService]
})
export class UrlModule { }

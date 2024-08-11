import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';
import { UrlController } from './url.controller';
import { UrlClickModule } from './urlclick/url-click.module';

@Module({
  imports:[UrlClickModule],
  providers: [UrlService, PrismaService],
  controllers: [UrlController],
  exports:[UrlService]
})
export class UrlModule { }







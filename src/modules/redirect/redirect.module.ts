import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { UrlService } from '../url/url.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
    providers: [UrlService,PrismaService],
    controllers: [RedirectController,]
})
export class RedirectModule { }

import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { UrlService } from '../url/url.service';
import { PrismaService } from '../prisma/prisma.service';
import { UrlClickService } from '../url/urlclick/url-click.service';
@Module({

    providers: [UrlService, PrismaService, UrlClickService],
    controllers: [RedirectController]
})
export class RedirectModule { }

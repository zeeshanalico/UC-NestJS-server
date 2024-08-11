import { Controller, Get, HttpException, HttpStatus, Param, Redirect, Req } from '@nestjs/common';
import { UrlService } from '../url/url.service';
import { IgnoreResponseInterceptor } from 'src/common/decorators/ignoreResponseInterceptor.decorator';
import { RedirectDto } from './redirect.dto';
import { Request } from 'express';
import { UrlClickService } from '../url/urlclick/url-click.service';
import { format } from 'date-fns';
import { CreateUrlClickDto } from '../url/urlclick/url-click.dto';
import { Prisma } from '@prisma/client';
@Controller('redirect')
export class RedirectController {
    constructor(private readonly urlService: UrlService, private readonly urlClickService: UrlClickService) { }

    @Redirect()
    @Get(':short_url')
    @IgnoreResponseInterceptor()
    async redirectUrl(@Req() req: Request, @Param() params: RedirectDto) {
        const urlDetail = await this.urlService.getUrlDetailsByShortUrl(params.short_url);
        if (!urlDetail) {
            throw new HttpException('url not found', HttpStatus.NOT_FOUND)
        }
        const ip_address = req.ip;
        const user_agent = req.headers['user-agent'] || '';
        const referrer = req.headers.referer || '';
        const access_date = new Date();  // Current date
        const access_time = new Date();  // Current time

        const clickData: CreateUrlClickDto = {
            url_id: urlDetail.url_id,
            access_date,
            access_time,
            ip_address,
            user_agent,
            referrer,
            country: null,
            city: null
        };

        this.urlClickService.createUrlClick(clickData);
        const original_url = await this.urlService.getOriginalUrl(params.short_url);
        return { url: original_url, statusCode: 302 };
    }
}
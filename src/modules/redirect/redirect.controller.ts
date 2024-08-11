import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from '../url/url.service';
import { IgnoreResponseInterceptor } from 'src/common/decorators/ignoreResponseInterceptor.decorator';
@Controller('redirect')
export class RedirectController {
    constructor(private readonly urlService: UrlService) {}

    @Redirect()
    @Get(':short_url')
    @IgnoreResponseInterceptor()
    async redirectUrl(@Param('short_url') short_url: string) {
        console.log('short url', short_url);
        
        const original_url = await this.urlService.getOriginalUrl(short_url);
        return { url: original_url, statusCode: 302 };
    }
}
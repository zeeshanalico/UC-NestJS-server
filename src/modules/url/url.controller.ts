import { Controller, Get, Post, Body, Req, Param, Redirect, NotFoundException, Patch, UseGuards, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request } from 'express';
import { CreateUrlDto, UpdateUrlDto } from './url.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
// 4ae3b08a-c2b6-46b2-94f7-d5ce540e8c9d
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { IgnoreResponseInterceptor } from 'src/common/decorators/ignoreResponseInterceptor.decorator';
import QrCodeWithLogo from 'qrcode-with-logos'
import * as path from 'path'

@Controller('url')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('ADMIN', "SUPER_ADMIN", 'USER')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Get('/')
    async getAllUrls(@Req() req: Request) {
        const urls = await this.urlService.getAllUrls(req.user.user_id);
        // const updatedUrls = urls.map((obj) => {
        //     return { ...obj, short_url: `localhost:3001/redirect/${obj.short_url}` };
        // });
        const updatedUrls = urls.map((url) => {
            const qrCodePath = path.join(this.urlService.uploadsDir, `${url.short_url}.png`);
            console.log(qrCodePath);
            
            return {
                ...url,
                short_url: `${process.env.MY_BASE_URL}/redirect/${url.short_url}`,
                qr_code: qrCodePath,
            };
        });
        return updatedUrls;
    }

    // @IgnoreResponseInterceptor()
    @ResponseMessage('Shorten url successfully')
    @Post('shorten')
    async shortenUrl(@Req() req: Request, @Body() createUrlDto: CreateUrlDto) {
        const short_url = await this.urlService.createShortUrl({ user_id: req.user.user_id, ...createUrlDto });
        return `${process.env.MY_BASE_URL}/url/${short_url}`;
    }

    //update
    @Patch('/:url_id')
    async updateUrl(@Param('url_id') url_id: string, @Body() updateUrlDto: UpdateUrlDto) {
        const updatedUrl = await this.urlService.updateUrl(url_id, updateUrlDto);
        return updatedUrl;
    }

    @Delete('/:url_id')
    @ResponseMessage('URL deleted successfully')
    async deleteUrl(@Req() req: Request, @Param('url_id') url_id: string) {
        await this.urlService.deleteUrl({ url_id, user_id: req.user.user_id });
        return { message: 'URL deleted successfully' };
    }
}

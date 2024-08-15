import { Controller, Get, Post, Body, Req, Param, Redirect, NotFoundException, Patch, UseGuards, Delete, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { CreateUrlDto, UpdateUrlDto } from './url.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
// 4ae3b08a-c2b6-46b2-94f7-d5ce540e8c9d
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { IgnoreResponseInterceptor } from 'src/common/decorators/ignoreResponseInterceptor.decorator';
import * as path from 'path'
import { transformShortUrl } from 'src/utils/transformShortUrl';
import { URLTYPE } from '@prisma/client';
@Controller('url')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('ADMIN', "SUPER_ADMIN", 'USER')

export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Get('/')
    async getAllUrls(@Req() req: Request) {
        const urls = await this.urlService.getAllUrls(req.user.user_id);

        const updatedUrls =
            urls.map((url) => {
                const qrCodePath = path.join(this.urlService.uploadsQrCodeDir, `${url.short_url}.png`);
                // const qr_code = await this.urlService.getQrCodeBinaryData(qrCodePath); // Passing short_url instead of qrCodePath
                return {
                    ...url,
                    short_url: transformShortUrl(url.short_url),
                };
            })
        return updatedUrls;
    }

    @Get('qr-image/:short_url')
    @IgnoreResponseInterceptor()
    getqrImage(@Req() req: Request, @Res() res: Response, @Param('short_url') short_url: string) {
        const qrCodePath = path.join(this.urlService.uploadsQrCodeDir, `${short_url}.png`);
        res.sendFile(qrCodePath);
    }

    // @IgnoreResponseInterceptor()
    @ResponseMessage('Shorten url successfully')
    @Post('shorten')
    async shortenUrl(@Req() req: Request, @Body() createUrlDto: CreateUrlDto) {
        const url = await this.urlService.createShortUrl({ user_id: req.user.user_id, ...createUrlDto });
        return url;
    }

    //update
    @Patch('/:url_id')
    async updateUrl(@Param('url_id') url_id: string, @Body() updateUrlDto: UpdateUrlDto) {
        const updatedUrl = await this.urlService.updateUrl(url_id, updateUrlDto);
        return updatedUrl;
    }

    @Get('/pregenerate:url_type')
    Pregenerate(@Req() req: Request, @Param() url_type: string) {
        const url = this.urlService.pregenerate({ user_id: req.user.user_id, url_type });
        return url;
    }

    @Delete('/:url_id')
    @ResponseMessage('URL deleted successfully')
    async deleteUrl(@Req() req: Request, @Param('url_id') url_id: string) {
        await this.urlService.deleteUrl({ url_id, user_id: req.user.user_id });
        return { message: 'URL deleted successfully' };
    }

    // ----------------------

    @Get('/tags')
    async getTags() {
        const tags = await this.urlService.getTags();
        const updateTags = tags.map(({ tag_name, tag_id }) => ({ tag_name, tag_id }))
        return updateTags;
    }

    @Get('/urltypes')
    getUrlTypes() {
        const urltypes: URLTYPE[] = this.urlService.getUrlTypes();
        return urltypes;//array of string
    }
}

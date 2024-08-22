import { Controller, Get, Post, Body, Req, Param, Redirect, NotFoundException, Patch, UseGuards, Delete, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { CreateUrlDto, PregenerateDto, UpdateUrlDto, UpdatePregeneratedUrlDto } from './url.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
// 4ae3b08a-c2b6-46b2-94f7-d5ce540e8c9d
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { IgnoreResponseInterceptor } from 'src/common/decorators/ignoreResponseInterceptor.decorator';
import * as path from 'path'
import { transformShortUrl } from 'src/utils/transformShortUrl';
import { URLTYPE } from '@prisma/client';
import * as fs from 'fs'
@Controller('url')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('ADMIN', "SUPER_ADMIN", 'USER')

export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Get('/')
    async getAllUrls(@Req() req: Request) {
        const { page = 1, limit = 5, pregenerated = false } = req.query;
        console.log(page, limit, pregenerated);

        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSize = parseInt(limit as string, 10) || 5;
        const offset = (pageNumber - 1) * pageSize;

        const urls = await this.urlService.getAllUrls({
            user_id: req.user.user_id,
            offset,
            limit: pageSize,
            pregenerated: Boolean(pregenerated),
        });

        // Transform and return the URLs
        var updatedUrls = urls.map((url) => ({
            short_url: transformShortUrl(url.short_url),
            ...url
        }));
        const totalRecords = await this.urlService.totalRecords({ pregenerated: pregenerated ? true : false });
        return { limit, pageNumber, offset, totalRecords, urls: updatedUrls };
    }

    @Get('qr-image/:short_url')
    @IgnoreResponseInterceptor()
    getqrImage(@Res() res: Response, @Param('short_url') short_url: string) {
        try {
            const qrCodePath = path.join(this.urlService.uploadsQrCodeDir, `${short_url}.png`);

            if (fs.existsSync(qrCodePath)) {
                return res.sendFile(qrCodePath);
            } else {
                // If the file doesn't exist, send a placeholder response
                return res.status(200).send(''); // Sending an empty response
            }
        } catch (error) {
            console.error('Error fetching QR image:', error);
            return res.status(500).send('An error occurred while fetching the QR image.');
        }
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
    
    @Patch('update-pregenerated/:url_id')
    async updatePregeneratedUrl(@Req() req: Request, @Param('url_id') url_id: string, @Body() updatePregeneratedUrl: UpdatePregeneratedUrlDto) {
        const updatedUrl = await this.urlService.updatePregeneratedUrl(req.user.user_id, url_id, updatePregeneratedUrl);
        return updatedUrl;
    }

    @Post('pregenerate')
    Pregenerate(@Req() req: Request, @Body() body: PregenerateDto) {
        const url = this.urlService.pregenerate({ user_id: req.user.user_id, url_type: body.url_type });
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

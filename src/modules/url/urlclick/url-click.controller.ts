import { Controller, Get, Post, Put, Delete, Param, Req, Body, Query, UseGuards } from '@nestjs/common';
import { UrlClickService } from './url-click.service';
import { CreateUrlClickDto, UpdateUrlClickDto } from './url-click.dto';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Request } from 'express';
import { URLwithClick } from './url-click.service';
import { Roles } from 'src/common/decorators/roles.deorator';
@Controller('url-clicks')
@Roles('ADMIN', 'SUPER_ADMIN', 'USER')
@UseGuards(TokenAuthGuard, RolesGuard)
export class UrlClickController {
    constructor(private readonly urlClickService: UrlClickService) { }

    @Get('/')
    async getAllUrlClicks(@Req() req: Request,) {
        req.user.user_id
        return this.urlClickService.getUrlClicks(req.user.user_id);
    }


    @Get('url-statistics')
    async getUrlClickStats(@Req() req: Request,) {
        const urls: URLwithClick = await this.urlClickService.getUrlClicks(req.user.user_id);
        const updatedInfo = urls.map((url) => {
            const { url_click, associated, deleted_at, is_pre_generated, logo_id, status, updated_at, url_id, associated_at, created_at, expiration_date, is_deleted, original_url, short_url, tag_id, url_type, user_id, } = url;
            return {
                url_id, original_url, short_url, created_at,
                clicks: url.url_click.length,
            }
        })
        return updatedInfo;
    }

    @Get(':click_id')
    async getUrlClick(@Param('click_id') click_id: number) {
        return this.urlClickService.getUrlClickById(click_id);
    }
    // @Post()
    // async createUrlClick(@Body() createUrlClickDto: CreateUrlClickDto) {
    //     return this.urlClickService.createUrlClick(createUrlClickDto);
    // }

    @Put(':click_id')
    async updateUrlClick(
        @Param('click_id') click_id: number,
        @Body() updateUrlClickDto: UpdateUrlClickDto,
    ) {
        return this.urlClickService.updateUrlClick(click_id, updateUrlClickDto);
    }

    @Delete(':click_id')
    async softDeleteUrlClick(@Param('click_id') click_id: number) {
        return this.urlClickService.softDeleteUrlClick(click_id);
    }
}

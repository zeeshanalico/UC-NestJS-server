import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UrlClickService } from './url-click.service';
import { CreateUrlClickDto, UpdateUrlClickDto } from './url-click.dto';

@Controller('url-clicks')
export class UrlClickController {
    constructor(private readonly urlClickService: UrlClickService) {}

    @Get()
    async getAllUrlClicks() {
        return this.urlClickService.getUrlClicks();
    }

    @Get(':click_id')
    async getUrlClick(@Param('click_id') click_id: number) {
        return this.urlClickService.getUrlClickById(click_id);
    }

    @Post()
    async createUrlClick(@Body() createUrlClickDto: CreateUrlClickDto) {
        return this.urlClickService.createUrlClick(createUrlClickDto);
    }

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

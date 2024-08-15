import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUrlClickDto, UpdateUrlClickDto } from './url-click.dto';
import { url as URL, url_click as URL_CLICK, Prisma } from '@prisma/client';

export type URLwithClick = Array<Prisma.urlGetPayload<{
    include: {
        url_click: true;
    };
}>>

@Injectable()
export class UrlClickService {
    constructor(private readonly prisma: PrismaService) {
        // this.getUrlClicks('4ae3b08a-c2b6-46b2-94f7-d5ce540e8c9d').then(res => console.log(res));
    }
    async getUrlClicks(user_id: string): Promise<URLwithClick> {
        return this.prisma.url.findMany({
            where: { user_id, is_deleted: false },
            include: {
                url_click: true,
            }
        });
    }

    async getUrlClickById(click_id: number) {
        return this.prisma.url_click.findUnique({
            where: { click_id },
        });
    }

    async createUrlClick(data: CreateUrlClickDto) {
        return this.prisma.url_click.create({ data });
    }

    async updateUrlClick(click_id: number, data: UpdateUrlClickDto) {
        return this.prisma.url_click.update({
            where: { click_id },
            data,
        });
    }

    async softDeleteUrlClick(click_id: number) {
        return this.prisma.url_click.update({
            where: { click_id },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
        });
    }
}

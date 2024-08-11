import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUrlClickDto, UpdateUrlClickDto } from './url-click.dto';

@Injectable()
export class UrlClickService {
    constructor(private readonly prisma: PrismaService) { }

    async getUrlClicks() {
        return this.prisma.url_click.findMany();
    }

    async getUrlClickById(click_id: number) {
        return this.prisma.url_click.findUnique({
            where: { click_id },
        });
    }

    async createUrlClick(data: CreateUrlClickDto) {
        return this.prisma.url_click.create({data});
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

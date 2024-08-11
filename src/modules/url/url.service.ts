import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { URLTYPE } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Prisma, url as URL } from '@prisma/client';
import QrCodeWithLogo from 'qrcode-with-logos';
import { join, resolve } from 'path';
import * as fs from 'fs'
import * as QRCode from 'qrcode'
@Injectable()
export class UrlService {
    constructor(private readonly prisma: PrismaService) { }
    public readonly uploadsDir = resolve(__dirname, '../../uploads');

    async generateQrCode(short_url: string): Promise<string> {
        const url = `${process.env.MY_BASE_URL}/redirect/${short_url}`;
        const qrCodePath = join(this.uploadsDir, `${short_url}.png`);
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(url); //data:image/png;base64,sdfsfklskldfjsj//returns  Data URL. A Data URL is a Base64 encoded representation of the image
            const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');//The 'base64' argument tells Buffer.from that the input string is Base64 encoded. The result is a Buffer containing the raw binary data of the image.

            if (!fs.existsSync(this.uploadsDir)) {
                fs.mkdirSync(this.uploadsDir);
            }

            fs.writeFileSync(qrCodePath, qrCodeBuffer);//(path, buffer:binary data)
            return qrCodePath;
        } catch (error) {
            throw new Error(`Failed to generate QR code: ${error.message}`);
        }
    }

    generateShortenUrl(): string {
        return randomBytes(7).toString('hex');
    }

    async createShortUrl({ user_id, original_url, url_type, expiration_date }: { user_id: string, original_url: string, url_type: URLTYPE, expiration_date: Date }): Promise<string> {
        const isoDate = new Date(expiration_date).toISOString()

        const short_url = this.generateShortenUrl();
        await this.prisma.url.create({
            data: {
                user_id,
                url_type,
                original_url,
                short_url,
                expiration_date: isoDate
            },
        });
        await this.generateQrCode(short_url);
        return short_url;
    }


    async getOriginalUrl(short_url: string): Promise<string> {
        const url = await this.prisma.url.findUnique({
            where: { short_url },
        });
        return url.original_url;
    }

    async getAllUrls(user_id: string) {
        const urls = await this.prisma.url.findMany({
            where: { user_id, is_deleted: false }
        })
        return urls;
    }

    async updateUrl(url_id: string, attributes: Partial<URL>): Promise<URL> {
        // Check if the URL exists
        const existingUrl = await this.prisma.url.findUnique({ where: { url_id } });
        if (!existingUrl) {
            throw new NotFoundException('URL not found');
        }

        const updatedUrl = await this.prisma.url.update({
            where: { url_id },
            data: {
                ...attributes, // Spread the partial attributes to update only the provided fields
                updated_at: new Date() // Update the timestamp
            },
        });
        return updatedUrl;
    }

    async deleteUrl({ user_id, url_id }: { user_id: string; url_id: string }) {
        const deletedUrl = await this.prisma.url.update({
            where: { user_id, url_id },
            data: { is_deleted: true }
        })
        return deletedUrl;
    }

    async getUrlDetailsByShortUrl(short_url: string):Promise<URL> {
        return this.prisma.url.findUnique({
            where: { short_url }
        })
    }
    // _____________________________________________

}

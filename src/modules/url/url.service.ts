import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { URLTYPE } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { url as URL } from '@prisma/client';
import { join, resolve } from 'path';
import * as fs from 'fs'
import * as QRCode from 'qrcode'
@Injectable()
export class UrlService {
    public readonly uploadsQrCodeDir = resolve('./src/uploads/qrcodes');
    constructor(private readonly prisma: PrismaService) {
        if (!fs.existsSync(this.uploadsQrCodeDir)) {
            fs.mkdirSync(this.uploadsQrCodeDir);
        }
    }

    async totalRecords({ pregenerated = false }: { pregenerated: boolean }): Promise<Number> { return await this.prisma.url.count({ where: { is_deleted: false, is_pre_generated: pregenerated } }) };

    async generateQrCode(short_url: string): Promise<string> {

        const url = `${process.env.MY_BASE_URL}/redirect/${short_url}`;
        const qrCodePath = join(this.uploadsQrCodeDir, `${short_url}.png`);

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(url); //data:image/png;base64,sdfsfklskldfjsj//returns  Data URL. A Data URL is a Base64 encoded representation of the image
            const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');//The 'base64' argument tells Buffer.from that the input string is Base64 encoded. The result is a Buffer containing the raw binary data of the image.


            fs.writeFileSync(qrCodePath, qrCodeBuffer);//(path, buffer:binary data)
            return qrCodePath;
        } catch (error) {
            throw new Error(`Failed to generate QR code: ${error.message}`);
        }
    }

    generateShortenUrl(): string {
        return randomBytes(7).toString('hex');
    }

    async pregenerate({ user_id, url_type }) {
        console.log(url_type);

        return await this.prisma.url.create({
            data: {
                url_type,
                user_id,
                short_url: this.generateShortenUrl(),
                is_pre_generated: true
            }
        })
    }

    async createShortUrl({ user_id, original_url, url_type, expiration_date, tag_name = null }: { user_id: string, original_url: string, url_type: URLTYPE, expiration_date: Date, tag_name?: string, }): Promise<any> {
        const isoDate = new Date(expiration_date).toISOString()
        const short_url = this.generateShortenUrl();
        //sequential vs interactive transaction
        const url = this.prisma.$transaction(async (tx) => {
            let url_tag = null;
            if (tag_name) {
                url_tag = await tx.url_tag.findFirst({
                    where: { user_id, tag_name, }
                })
                if (!url_tag) {
                    url_tag = await tx.url_tag.create({
                        data: { tag_name, user_id }
                    })
                }
            }
            const url = await tx.url.create({
                data: {
                    url_type,
                    original_url,
                    short_url,
                    user_id,
                    tag_id: url_tag?.tag_id ?? null,
                    expiration_date: isoDate
                },
            });
            return url;
        })

        await this.generateQrCode(short_url);
        return url;

    }


    async getOriginalUrl(short_url: string): Promise<{ original_url: string, expiration_date: Date }> {
        const { original_url, expiration_date } = await this.prisma.url.findUnique({
            where: { short_url },
        });
        return { original_url, expiration_date };
    }


    async getAllUrls({ user_id, offset, limit, pregenerated }: { user_id: string; offset: number; limit: number; pregenerated: boolean }) {

        const urls = await this.prisma.url.findMany({
            where: {
                user_id,
                is_deleted: false,
                is_pre_generated: pregenerated,
            },
            include: {
                logo: true,
                url_tag: true,
                url_click: true

            },
            skip: offset,
            take: limit,
        });
        return urls;
    }

    async updateUrl(url_id: string, attributes: Partial<URL>): Promise<URL> {
        let isoDate = null;
        if (attributes.expiration_date) {
            isoDate = new Date(attributes.expiration_date).toISOString()
        }
        attributes = { ...attributes, expiration_date: isoDate };
        const existingUrl = await this.prisma.url.findUnique({ where: { url_id } });
        if (!existingUrl) {
            throw new NotFoundException('URL not found');
        }

        const updatedUrl = await this.prisma.url.update({
            where: { url_id },
            data: {
                ...attributes,
                updated_at: new Date()
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

    async getUrlDetailsByShortUrl(short_url: string): Promise<URL> {
        return this.prisma.url.findUnique({
            where: { short_url }
        })
    }
    getUrlTypes(): URLTYPE[] {
        const urlTypes: URLTYPE[] = ["store", "product", "misc"];
        return urlTypes
    }

    async updatePregeneratedUrl(user_id: string, url_id: string, data: Partial<URL> & { tag_name: string }) {
        const { tag_name, url_type, expiration_date, original_url } = data
        return await this.prisma.$transaction(async (tx) => {

            let url_tag = null;
            if (tag_name) {
                url_tag = await tx.url_tag.findFirst({
                    where: { user_id, tag_name, }
                })

                if (!url_tag) {
                    url_tag = await tx.url_tag.create({
                        data: { tag_name, user_id }
                    })
                }
            }
            console.log('url tag ____', url_tag);


            const data = {
                expiration_date: new Date(expiration_date).toISOString(),
                url_id,
                url_type,
                original_url,
                associated_at: new Date(),
                is_pre_generated: false,
                tag_id: url_tag?.tag_id ?? null,
            }

            const res = await tx.url.update({
                where: { is_pre_generated: true, url_id },
                data: { ...data }
            })
            return res;
        })
    }

    // _____________________________________________

    async getTags() {
        const tags = this.prisma.url_tag.findMany({})
        return tags
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { api_key as ApiKey, user as PrismaUser } from '@prisma/client';
import { randomBytes } from 'crypto';

export interface ApiKeyWithUser extends ApiKey {
    user?: PrismaUser;
}

@Injectable()
export class ApiKeyService {
    constructor(private readonly prisma: PrismaService) { }

    async createApiKey(createApiKeyDto: Partial<ApiKey>): Promise<ApiKey | { message: string, status:boolean}> {
        const { user_id, api_key, expires_at } = createApiKeyDto;
        const existedApiKey = await this.getApiKeybyUserId(createApiKeyDto.user_id)
        if (existedApiKey) {
            throw new Error('api key already exists for this user')
        }
        const newApiKey = this.prisma.api_key.create({
            data: {
                user_id,
                api_key,
                expires_at: new Date(expires_at).toISOString(),
            }
        });
        return newApiKey;
    }

    async findApiKeyById(api_key_id: number): Promise<ApiKeyWithUser> {
        const key = await this.prisma.api_key.findUnique({
            where: { api_key_id },
            include: { user: true },
        });
        if (!key) throw new NotFoundException(`API key with ID ${api_key_id} not found`);
        return key;
    }

    async updateApiKey(api_key_id: number, data: Partial<ApiKey>): Promise<ApiKey> {
        const existingKey = await this.prisma.api_key.findUnique({ where: { api_key_id } });
        if (!existingKey) throw new NotFoundException(`API key with ID ${api_key_id} not found`);

        return this.prisma.api_key.update({
            where: { api_key_id },
            data,
        });
    }

    async deleteApiKey(api_key_id: number): Promise<ApiKey> {
        const existingKey = await this.prisma.api_key.findUnique({ where: { api_key_id } });
        if (!existingKey) throw new NotFoundException(`API key with ID ${api_key_id} not found`);

        return this.prisma.api_key.delete({
            where: { api_key_id },
        });
    }

    generateApiKey(): string {
        return randomBytes(32).toString('hex');
    }

    async findByApiKey(api_key: string): Promise<ApiKeyWithUser> {
        const key = await this.prisma.api_key.findUnique({
            where: { api_key },
        });
        return key;
    }

    async getApiKeybyUserId(user_id: string) {
        return await this.prisma.api_key.findFirst({
            where: { user_id }
        })
    }
    async getAllApiKeys(user_id: string): Promise<ApiKeyWithUser[]> {
        const keys = await this.prisma.api_key.findMany({
            where: { user_id },
            include: { user: true },
        });
        return keys;
    }
}






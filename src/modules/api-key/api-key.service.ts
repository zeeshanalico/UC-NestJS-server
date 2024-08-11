import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './api-key.dto';
import { PrismaService } from '../prisma/prisma.service';
import { api_key as ApiKey, user as PrismaUser } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

export interface ApiKeyWithUser extends ApiKey {
    user?: PrismaUser
}
// Partial : makes all attr optional
// omit : eliminate some attrs//it doesn't make that attr optional

@Injectable()
export class ApiKeyService {
    constructor(private readonly prisma: PrismaService) {
        // this.createApiKey({api_key:'sdddsfsddff',user_id:'b3b101c8-2c8f-4b0c-9450-6eb18a471b23',expires_at:new Date()});
        // this.findByApiKey('sdddsfsddff').then(res => console.log(res));


    }
    async createApiKey(createApiKeyDto: Partial<ApiKey>): Promise<ApiKey> {
        const { user_id, api_key, expires_at } = createApiKeyDto;
        const newApiKey = this.prisma.api_key.create({
            data: {
                user_id,
                api_key,
                expires_at,
            }
        });
        return newApiKey;
    }

    generateApiKey(): string {
        return randomBytes(32).toString('hex');
    }

    async findByApiKey(api_key: string): Promise<ApiKeyWithUser> {
        const key = await this.prisma.api_key.findUnique({
            where: { api_key },
            include: { user: true },
        });
        return key;
    }

}


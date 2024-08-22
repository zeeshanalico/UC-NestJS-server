import { Controller, Post, Body, Get, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { Request } from 'express';
import { api_key as ApiKey } from '@prisma/client';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('apikey')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'USER')

export class ApiKeyController {

    constructor(private readonly apiKeyService: ApiKeyService) { }
    @Get('/all')
    async getAllApiKeys(@Req() req: Request) {
        const { user_id } = req.user;
        const apiKeys = await this.apiKeyService.getAllApiKeys(user_id);
        return apiKeys
    }

    @ResponseMessage('Api Key created Successfully')
    @Post('/')
    async createApiKey(@Req() req: Request, @Body('expiration_date') expires_at?: Date) {
        const { user_id } = req.user;
        const api_key = this.apiKeyService.generateApiKey()
        const newApiKey = await this.apiKeyService.createApiKey({ user_id, expires_at, api_key });
        return newApiKey;
    }

    @Get(':id')
    async getApiKeyById(@Param('id') id: number) {
        const apiKey = await this.apiKeyService.findApiKeyById(id);
        return apiKey;
    }

    @Put(':id')
    async updateApiKey(@Param('id') id: number, @Body() updateData: Partial<ApiKey>) {
        const updatedApiKey = await this.apiKeyService.updateApiKey(id, updateData);
        return { message: 'API key updated successfully', data: updatedApiKey };
    }

    @Delete(':id')
    async deleteApiKey(@Param('id') id: string) {
        const deletedApiKey = await this.apiKeyService.deleteApiKey(parseInt(id));
        return deletedApiKey;
    }


}

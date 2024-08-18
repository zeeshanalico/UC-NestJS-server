import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './api-key.dto';
import { AuthService } from '../auth/auth.service';

@Controller('apikey')
export class ApiKeyController {
    constructor(private readonly apiKeyService: ApiKeyService, private readonly authService: AuthService) { }
    @Post()
    createApiKey(@Req() req: Request) {
        const { user_id, user_role, username } = req.user;
        const { expires_at } = req.body;
        const api_key = this.apiKeyService.generateApiKey();
        this.apiKeyService.createApiKey({ user_id, api_key, expires_at });
    }

}

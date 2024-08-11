import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';
@Injectable()
export class ApiKeyAuthMiddleware implements NestMiddleware {
    constructor(private readonly apiKeyService: ApiKeyService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['x-api-key'];
        // const apiKey = req.header('x-api-key');
        if (!apiKey) {
            throw new UnauthorizedException('API Key is missing');
        }
        const key = await this.apiKeyService.findByApiKey(apiKey as string);
        if (!key) {
            throw new UnauthorizedException('Invalid or revoked API Key');
        }
        req.apiKey = key;
        next();
    }
}

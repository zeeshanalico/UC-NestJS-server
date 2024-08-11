import { Module } from '@nestjs/common';
import { UrlClickService } from './url-click.service';
import { UrlClickController } from './url-click.controller';

@Module({
    providers: [UrlClickService],
    controllers: [UrlClickController],
})
export class UrlClickModule { }

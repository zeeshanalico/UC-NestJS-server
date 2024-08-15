import { Module } from '@nestjs/common';
import { UrlClickService } from './url-click.service';
import { UrlClickController } from './url-click.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
@Module({
    providers: [UrlClickService,PrismaService],
    controllers: [UrlClickController],
    exports:[UrlClickService]
})
export class UrlClickModule { }


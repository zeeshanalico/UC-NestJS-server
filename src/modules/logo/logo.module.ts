import { Module } from '@nestjs/common';
import { LogoController } from './logo.controller';
import { LogoService } from './logo.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [LogoController],
    providers: [LogoService,PrismaService]
})
export class LogoModule { }

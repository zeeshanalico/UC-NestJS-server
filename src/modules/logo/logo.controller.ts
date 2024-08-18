import { Body, Post, Get, Req, Res } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { LogoService } from './logo.service';
import { Request } from 'express';
import { UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { logo as LOGO } from '@prisma/client';
import { transformLogoPath } from 'src/utils/transformShortUrl';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
@Controller('logo')
@Roles('ADMIN','SUPER_ADMIN','USER')
@UseGuards(TokenAuthGuard, RolesGuard)
export class LogoController {
    constructor(private readonly logoService: LogoService) { }

    @Get()
    async getLogos(@Req() req: Request) {
        const user_id = req.user.user_id;
        const logos: LOGO[] = await this.logoService.findAll({ user_id });
        const updatedLogos = logos.map((logo) => {
            return { ...logo, logo_path: transformLogoPath(logo.logo_path) };
        });
        return updatedLogos;
    }

    @Post('/create')
    @UseInterceptors(FilesInterceptor('files')) // Matches FormData key 'files'
    async createLogo(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        const user_id = req.user.user_id
        const logoPaths: string[] = files.map((file) => {
            return this.logoService.saveLogo({ user_id, file });
        })
        const totalRowsAffected = await this.logoService.create({ user_id, logoPaths });
        return totalRowsAffected;
    }

}





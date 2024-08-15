import { Body, Post,Get, Req ,Res} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { LogoService } from './logo.service';
import { Request } from 'express';
import { UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { logo as LOGO } from '@prisma/client';
@Controller('logo')
@UseGuards(TokenAuthGuard)
export class LogoController {
    constructor(private readonly logoService: LogoService) {


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

    @Get()
    async getLogos(@Req() req: Request,@Res() res: Response,) {
        const logos: LOGO[] = await this.logoService.findAll();
    }
    
}





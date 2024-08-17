import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, logo as LOGO } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class LogoService {
  public readonly uploadsLogoDir = path.resolve('./src/uploads/logos');

  constructor(private readonly prisma: PrismaService) {
    //make logos directory if not exists
    if (!fs.existsSync(this.uploadsLogoDir)) {
      fs.mkdirSync(this.uploadsLogoDir);
    }
  }

  async create({ user_id, logoPaths }: { user_id: string, logoPaths: string[] }): Promise<Prisma.BatchPayload> {
    const logo = await this.prisma.logo.createMany({
      data: logoPaths.map((logo_path) => {
        return { user_id, logo_path };
      })
    });
    return logo;
  }

  saveLogo({ file, user_id }: { file: Express.Multer.File; user_id: string }): string {
    const userLogoPath = path.join(this.uploadsLogoDir, `/${user_id}`,);
    if (!fs.existsSync(userLogoPath)) {
      fs.mkdirSync(userLogoPath);
    }
    // {
    //   fieldname: 'files',
    //   originalname: 'Screenshot (1).png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 05 56 00 00 03 00 08 06 00 00 00 cf 3e 3c c2 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 04 ... 53224 more bytes>,
    //   size: 53274
    // } : Express.Multer.File

    const logoPath = path.join(userLogoPath, `${file.originalname}.png`);
    const fileBuffer = Buffer.from(file.buffer);//The 'base64' argument tells Buffer.from that the input string is Base64 encoded. The result is a Buffer containing the raw binary data of the image.
    fs.writeFileSync(logoPath, fileBuffer);//(path, buffer:binary data)
    return logoPath;
  }
  // Find all logos
  async findAll({ user_id }: { user_id: string }): Promise<LOGO[]> {
    return this.prisma.logo.findMany({
      where: { is_deleted: false, user_id },
    });
  }

  // Find a single logo by ID
  async findOne(logo_id: number): Promise<LOGO> {
    const logo = await this.prisma.logo.findUnique({
      where: { logo_id },
    });

    if (!logo || logo.is_deleted) {
      throw new NotFoundException(`Logo with ID ${logo_id} not found`);
    }
    return logo;
  }

  async update(logo_id: number, data: Prisma.logoUpdateInput): Promise<LOGO> {
    const logoExists = await this.prisma.logo.findUnique({
      where: { logo_id },
    });
    if (!logoExists || logoExists.is_deleted) {
      throw new NotFoundException(`Logo with ID ${logo_id} not found`);
    }

    return this.prisma.logo.update({
      where: { logo_id },
      data,
    });
  }

  // Soft delete a logo by ID
  async remove(logo_id: number): Promise<LOGO> {
    const logoExists = await this.prisma.logo.findUnique({
      where: { logo_id },
    });

    if (!logoExists || logoExists.is_deleted) {
      throw new NotFoundException(`Logo with ID ${logo_id} not found`);
    }

    return this.prisma.logo.update({
      where: { logo_id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }
}

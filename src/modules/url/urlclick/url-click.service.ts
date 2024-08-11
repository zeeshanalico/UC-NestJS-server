import { PrismaService } from "src/modules/prisma/prisma.service";
export class UrlClickService{
    constructor(private readonly prisma:PrismaService){}
    
async getUrlClicks() {
    return await this.prisma.url_click.findMany();
  }

  async getUrlClickById(click_id: number) {
    return await this.prisma.url_click.findUnique({
      where: { click_id },
    });
  }

  async softDeleteUrlClick(id: number) {
    return await this.prisma.url_click.update({
      where: { click_id: id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

//   async createUrlClick(data: z.infer<typeof createUrlClickDto>) {
//     const validatedData = createUrlClickDto.parse(data);

//     return await this.prisma.url_click.create({
//       data: validatedData,
//     });
//   }

}
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }
   getUsers(): any  {
    console.log('get users');
    console.log(process.env.NODE_ENV);

    
    return this.prisma.user.findMany();
  }
}

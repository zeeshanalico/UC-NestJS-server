import { Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService, PrismaService, AuthService, UserService]
})
export class ApiKeyModule { }

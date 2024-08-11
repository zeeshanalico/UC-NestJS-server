import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: '7d' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService],
  exports: [AuthService]
})
export class AuthModule { }

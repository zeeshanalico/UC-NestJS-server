import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../prisma/prisma.service";
import { LoggerService } from "../logger/logger.service";

@Module({
    controllers: [UserController],
    providers: [UserService,PrismaService,LoggerService],
    exports:[UserService]
})

export class UserModule {}
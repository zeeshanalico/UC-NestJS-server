import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthService } from "./auth.service";
@Module({
    controllers: [AuthController],
    providers:[AuthService],
    imports: [PrismaModule]
})


export class AuthModule { };
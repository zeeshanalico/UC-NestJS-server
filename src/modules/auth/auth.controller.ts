import { Body, Controller, ValidationPipe, HttpCode, Post, HttpStatus, ConflictException, HttpException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Prisma, } from '@prisma/client';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')

    async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
        const token = await this.authService.signIn(signInDto)
        return { data: token, statusCode: 200 }
    }

    @Post('signup')
    async signUp(@Body(ValidationPipe) { email, password, username, role_id }: SignUpDto) {
        const user = await this.authService.signUp(email, password, username, role_id);
        return { statusCode: HttpStatus.OK, data: user };
    }
}






// console.log(e instanceof HttpException);
// console.log(e instanceof Prisma.PrismaClientKnownRequestError);

// if (e instanceof ConflictException) {
//     throw new HttpException('Username or email already exist s', HttpStatus.CONFLICT);
// }
// if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
//     throw new ConflictException(e.message);
// }
// throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);

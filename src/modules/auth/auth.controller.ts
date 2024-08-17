import { Body, Controller, UnauthorizedException, ValidationPipe, HttpCode, Post, HttpStatus, ConflictException, HttpException } from '@nestjs/common';
import { SignInDto, SignUpDto, AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { generateUsername } from 'unique-username-generator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
        const user = await this.authService.signIn(signInDto)
        return user 
    }

    @Post('signup')
    @ResponseMessage('Thanks for signing up!')
    async signUp(@Body(ValidationPipe) { email, password, role_id }: SignUpDto) {
        const username=generateUsername(email, 5);
        const user = await this.authService.signUp({username,email, password, role_id});
        return user;
    }

    @Post('authenticate')
    async authenticate(@Body(ValidationPipe) { access_token }: AuthDto) {
        try {
            const user = await this.authService.decodeToken(access_token);
            return  user
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid access token');
            } else if (error instanceof UnauthorizedException) {
                throw error
            } else {
                console.error('Unexpected authentication error:', error);
                throw new UnauthorizedException('Authentication failed');
            }
        }
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

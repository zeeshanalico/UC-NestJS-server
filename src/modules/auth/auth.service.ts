import { HttpException, Injectable, UnauthorizedException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/user';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) { }
    // jwtService = new JwtService()

    async signIn({ email, password }: { email: string, password: string }): Promise<{ access_token: string | null; user_role: { role_id: number; role_name: string }; }> {
        const user = await this.userService.getUserByEmail({ email });
        if (!user) {
            throw new HttpException('Invalid email', 401);
        }
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            throw new HttpException('Invalid password', 401);
        }
        const payload: UserPayload = { user_id: user.user_id, username: user.username, user_role: user.user_role };
        const access_token = await this.jwtService.signAsync(payload, { secret: process.env.SECRET_KEY })
        const { role_id, role_name } = user.user_role

        return { access_token, user_role: { role_id, role_name } };
    }

    async signUp({ email, password, username, role_id }: { email: string, password: string, username: string, role_id: number }): Promise<any> {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const user = await this.userService.createUser({ username, email, password_hash, role_id });
        return user;
    }

    async decodeToken(access_token: string): Promise<UserPayload> {
        const decodedToken = await this.jwtService.verify(access_token, { secret: process.env.SECRET_KEY });
        if (!decodedToken) {
            throw new UnauthorizedException('Invalid access token');
        }
        const user = await this.userService.findUserByUsername({ username: decodedToken.username });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return { user_id: user.user_id, username: user.username, user_role: user.user_role };
    }
}

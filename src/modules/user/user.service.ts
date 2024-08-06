import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { user as PrismaUser, user_role as PrismaUserRole } from '@prisma/client';
interface UserWithRole extends PrismaUser {
  user_role?: PrismaUserRole; // Adjust if user_role is mandatory or optional
}
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {

    // const a = this.getUserByEmail({ email: 'zeeshanalico24@gmail.com', user_role: true });
    // console.log(a);

  }

  async createUser({ username, email, password_hash, role_id  }: CreateUserDto): Promise<PrismaUser> {

    const user = await this.prisma.user.create({
      data: { username, email, password_hash, role_id },
    });
    console.log(user)
    return user;
  }

  async getUsers(): Promise<PrismaUser[]> {
    const users = await this.prisma.user.findMany({
      where: { is_deleted: false },
    });

    if (users.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async getUserById(user_id: string): Promise<PrismaUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });
    return user;
  }
  async getUserByEmail({ email }: { email: string }): Promise<UserWithRole | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { user_role: true }
    });
    return user;
  }
  async findUserByUsername({ username }: { username: string }): Promise<UserWithRole | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { user_role: true }
    });
    return user;
  }

  // Update User
  async updateUser(
    user_id: string,
    username: string,
    email: string,
    role_id?: number,
  ): Promise<PrismaUser> {
    const user = await this.prisma.user.update({
      where: { user_id },
      data: { username, email, role_id },
    });
    return user;

  }

  // Soft Delete User
  async deleteUser(user_id: string): Promise<PrismaUser> {
    const user = await this.prisma.user.update({
      where: { user_id },
      data: { is_deleted: true, deleted_at: new Date() },
    });
    return user;
  }
}

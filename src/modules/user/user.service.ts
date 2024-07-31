import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { user } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  // Create User
  async createUser(
    username: string,
    email: string,
    password_hash: string,
    role_id?: number,
  ): Promise<user> {
    try {
      const user = await this.prisma.user.create({
        data: { username, email, password_hash, role_id },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(): Promise<user[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { is_deleted: false },
      });

      if (users.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }

      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(user_id: string): Promise<user | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error
    }
  }

  // Update User
  async updateUser(
    user_id: string,
    username: string,
    email: string,
    role_id?: number,
  ): Promise<user> {
    try {
      const user = await this.prisma.user.update({
        where: { user_id },
        data: { username, email, role_id },
      });
      return user;
    } catch (error) {
      throw error
    }
  }

  // Soft Delete User
  async deleteUser(user_id: string): Promise<user> {
    try {
      const user = await this.prisma.user.update({
        where: { user_id },
        data: { is_deleted: true, deleted_at: new Date() },
      });
      return user;
    } catch (error) {
      throw error
    }
  }
}

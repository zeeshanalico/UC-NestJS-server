import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpException, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaExceptionFilter } from 'src/common/exceptions/exceptions/prisma-exception.filter';
import { LoggerService } from '../logger/logger.service';
import { user } from '@prisma/client'; 
import { CreateUserDto, UpdateUserDto } from './user.dto'; 

@Controller('users')
// @UseFilters(new PrismaExceptionFilter(new LoggerService())) 
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser: user = await this.userService.createUser(
        createUserDto.username,
        createUserDto.email,
        createUserDto.password_hash,
        createUserDto.role_id,
      );
      return { statusCode: HttpStatus.CREATED, data: newUser };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getUsers() {
    try {
      const users: user[] = await this.userService.getUsers();
      return { statusCode: HttpStatus.OK, data: users };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user: user | null = await this.userService.getUserById(id);
      return { status: HttpStatus.OK, data: user };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser: user = await this.userService.updateUser(
        id,
        updateUserDto.username,
        updateUserDto.email,
        updateUserDto.role_id,
      );
      return { status: HttpStatus.OK, data: updatedUser };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const deletedUser: user = await this.userService.deleteUser(id);
      return { status: HttpStatus.OK, data: deletedUser };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

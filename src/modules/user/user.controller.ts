import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpStatus, HttpException, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaExceptionFilter } from 'src/common/exceptions/prisma-exception.filter';
import { LoggerService } from '../logger/logger.service';
import { user } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { ValidationPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
//sequence of decorators doesn't matter because these are instantiated in class definition phase
@Controller('users')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('admin', 'user')
@UseFilters(new PrismaExceptionFilter(new LoggerService()))
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const newUser: user = await this.userService.createUser(createUserDto);
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
  @Get('username') // Updated endpoint
  @Public()
  async checkUsernameAvailability(@Query('username') username: string) {
    try {
      if (!username) {
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Username is required' };
      }
      const user: user = await this.userService.findUserByUsername({ username });
      console.log(user);
      
      if (!user) {
        return { statusCode: HttpStatus.OK, data: { isAvailable: false } };
      }
      return { statusCode: HttpStatus.OK, data: { isAvailable: true } };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

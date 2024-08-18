import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpStatus, HttpException, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { user } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ValidationPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.deorator';
import { TokenAuthGuard } from 'src/common/guards/token-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {ResponseMessage} from 'src/common/decorators/response-message.decorator';

@Controller('users')
@UseGuards(TokenAuthGuard, RolesGuard)
@Roles('ADMIN','SUPER_ADMIN')
// @UseFilters(new PrismaExceptionFilter(new LoggerService()))

export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post()
  @ResponseMessage('User created successfully')
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
      const newUser: user = await this.userService.createUser(createUserDto);
      return { statusCode: HttpStatus.CREATED, data: newUser };
  }
  
  @Get()
  @ResponseMessage('Users retrieved successfully')
  async getUsers() {
      const users: user[] = await this.userService.getUsers();
      return   users;
  }

  @Get('/')
  @Public()
  async checkUsernameAvailability(@Query('username') username: string) {
      if (!username) {
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Username is required' };
      }
      const user: user = await this.userService.findUserByUsername({ username });
      if (!user) {
        return { statusCode: HttpStatus.OK, data: { isAvailable: false } };
      }
      return  { isAvailable: true } ;
    }

  @Get(':id')
  @ResponseMessage('User retrieved successfully')
  async getUserById(@Param('id') id: string) {
      const user: user | null = await this.userService.getUserById(id);
      return { status: HttpStatus.OK, data: user };
  }

  @Put(':id')
  @ResponseMessage('user updated successfully')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
      const updatedUser: user = await this.userService.updateUser(
        id,
        updateUserDto.username,
        updateUserDto.email,
        updateUserDto.role_id,
      );
      return  updatedUser ;
  }

  @Delete(':id')
  @ResponseMessage('user Deleted successfully')
  async deleteUser(@Param('id') id: string) {
      const deletedUser: user = await this.userService.deleteUser(id);
      return deletedUser;
  }
}

import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password_hash: string;

  @IsOptional()
  @IsNumber({}, { message: 'Role ID must be a number' })
  role_id?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsOptional()
  @IsNumber({}, { message: 'Role ID must be a number' })
  role_id?: number;
}

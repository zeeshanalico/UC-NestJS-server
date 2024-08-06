import { IsString, IsOptional, IsEnum, IsNotEmpty, IsEmail, MinLength, isNotEmpty, IsNumber } from 'class-validator';
import { URLTYPE, STATUS } from '@prisma/client';

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    // @IsNotEmpty()
    // @IsString()
    // username: string;

    @IsOptional()
    @IsNumber()
    role_id: number;
}


export class AuthDto {
    @IsNotEmpty()
    @IsString()
    access_token:string;
}



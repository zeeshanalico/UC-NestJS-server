import { IsString, IsOptional, IsDate, IsNotEmpty, IsBoolean } from 'class-validator';
import { Prisma, } from '@prisma/client';

export class CreateUrlClickDto {
    @IsString()
    @IsNotEmpty()
    url_id: string; // UUID or similar unique identifier for the URL
  
    @IsDate()
    @IsNotEmpty()
    access_date: Date;
  
    @IsDate()
    @IsNotEmpty()
    access_time: Date;
  
    @IsString()
    @IsNotEmpty()
    ip_address: string;
  
    @IsString()
    @IsNotEmpty()
    user_agent: string;
  
    @IsOptional()
    @IsString()
    referrer?: string;
  
    @IsOptional()
    @IsString()
    country?: string|null;
  
    @IsOptional()
    @IsString()
    city?: string|null;
  
    @IsOptional()
    @IsDate()
    deleted_at?: Date;
  
    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;
}

export class UpdateUrlClickDto {
    @IsOptional()
    @IsString()
    url_id?: string; // UUID or similar unique identifier for the URL
  
    @IsOptional()
    @IsDate()
    access_date?: Date;
  
    @IsOptional()
    @IsDate()
    access_time?: Date;
  
    @IsOptional()
    @IsString()
    ip_address?: string;
  
    @IsOptional()
    @IsString()
    user_agent?: string;
  
    @IsOptional()
    @IsString()
    referrer?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsDate()
    deleted_at?: Date;
  
    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;
}

import { IsString, IsOptional, IsEnum, IsNotEmpty , IsDate, IsBoolean} from 'class-validator';
import { URLTYPE, STATUS } from '@prisma/client';

export class CreateUrlDto {
  @IsString()
  original_url: string;

  @IsString()
  @IsOptional()
  tag_name?: string;

  @IsNotEmpty()
  expiration_date:Date;
  
  @IsEnum(URLTYPE)
  url_type: URLTYPE;
  
  @IsOptional()
  @IsEnum(STATUS)
  status: STATUS;
}

export class UpdateUrlDto {
  @IsOptional()
  @IsString()
  original_url?: string;
  @IsOptional()
  @IsString()
  url_id?: string;

  @IsOptional()
  @IsString()
  short_url?: string;

  @IsOptional()
  associated?: boolean;

  @IsOptional()
  @IsString()
  expiration_date?: Date;

  @IsOptional()
  @IsEnum(URLTYPE)
  url_type?: URLTYPE;

  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

}




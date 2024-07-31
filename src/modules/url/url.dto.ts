import { IsString, IsOptional, IsEnum } from 'class-validator';
import { URLTYPE, STATUS } from '@prisma/client';

export class CreateUrlDto {
  @IsString()
  original_url: string;

  @IsOptional()
  @IsString()
  short_url: string;

  @IsEnum(URLTYPE)
  url_type: URLTYPE;

  @IsEnum(STATUS)
  status: STATUS;
}

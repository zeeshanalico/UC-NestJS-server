import { IsUUID, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateApiKeyDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    api_key: string;

    @IsDateString()
    expires_at: Date;
}

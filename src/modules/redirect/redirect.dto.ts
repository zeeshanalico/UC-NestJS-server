import { IsString, IsNotEmpty } from 'class-validator';

export class RedirectDto {
    // @IsString()
    @IsNotEmpty()
    short_url: string; 
}

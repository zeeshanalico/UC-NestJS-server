import { Expose } from 'class-transformer';
 
export class UserResponseDto {
  @Expose()
  id: string;
 
  @Expose()
  email: string;
 
  @Expose()
  role: string;
 
  @Expose()
  createdAt: Date;
 
  @Expose()
  updatedAt: Date;
}


//for paginated response
export class UsersResponseDto {
    @Expose()
    users: UserResponseDto[];
   
    @Expose()
    total: number;
   
    @Expose()
    limit: number;
   
    @Expose()
    offset: number;
  }
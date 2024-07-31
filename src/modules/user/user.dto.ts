
export class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    role_id?: number;
  }
  
  export class UpdateUserDto {
    username: string;
    email: string;
    role_id?: number;
  }
  
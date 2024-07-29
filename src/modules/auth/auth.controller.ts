import { Get, Body, Controller, Post,Headers,Header,Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller()
export class AuthController {
    constructor(private readonly authService:AuthService){}
    
    @Get()
    async getUser(){
        return await this.authService.getUsers();
    }

    // @Post()
    // @Header('Content-type','application/html')
    // signup(@Body() body: any, @Headers() headers: any): string {
    //     try {
    //         console.log(body);
            
    //         console.log(headers);
    //         return body;
    //     } catch (error) {
    //         console.log('this is error',error);
            
    //     }
    // }
}



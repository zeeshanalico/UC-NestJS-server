// src/common/guards/token-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from 'src/types/user';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const isPublic = this.reflector.get<string>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = this.jwtService.verify<UserPayload>(token, {
        secret: process.env.SECRET_KEY,
      });
      request.user = payload; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;

    const [bearer, token] = authHeader.split(' ');
    return bearer === 'Bearer' ? token : null;
  }
}

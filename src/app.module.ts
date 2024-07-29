import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    isGlobal: true,

  }),
    AuthModule],



})
export class AppModule { }

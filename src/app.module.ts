import { Module, } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionsFilter } from './common/exceptions/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ResponseInterceptor } from './common/Interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UrlModule } from './modules/url/url.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    isGlobal: true,
  }),
    LoggerModule,
    PrismaModule,
    UserModule,
    AuthModule,
    UrlModule,
    AnalyticsModule,
    ApiKeyModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    AuthService,
  ]
})

export class AppModule { }

// export class AppModule implements NestModule {

//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(LoggerMiddleware)
//       .forRoutes('*');
//   }
// }

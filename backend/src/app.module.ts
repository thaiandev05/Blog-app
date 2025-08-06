import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthCookieGuard } from './common/guard/auth-cookie.guard';
import { EmailModule } from './email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomCacheModule } from './modules/custom-cache/customCache.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, EmailModule, CustomCacheModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 50000,
      max: 100
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (reflector: Reflector) => new AuthCookieGuard(reflector),
    },
  ],
})
export class AppModule { }

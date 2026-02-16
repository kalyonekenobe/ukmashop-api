import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { LoggerModule } from 'src/modules/infrastructure/logger/logger.module';
import { LoggerMiddleware } from 'src/modules/infrastructure/logger/middlewares/logger.middleware';
import { PasswordModule } from 'src/modules/infrastructure/password/password.module';
import { PasswordModuleOptions } from 'src/modules/infrastructure/password/types/password.types';
import { PrismaModule } from 'src/modules/infrastructure/prisma/prisma.module';
import { UserModule } from 'src/modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { buildPasswordModuleOptions } from 'src/modules/infrastructure/password/password.constants';
import { buildWinstonModuleOptions } from 'src/modules/infrastructure/logger/logger.constants';
import { buildJwtModuleOptions } from 'src/modules/infrastructure/jwt/jwt.constants';
import { buildConfigModuleOptions } from 'src/modules/infrastructure/config/config.constants';
import { AuthModule } from 'src/modules/auth/auth.module';
import { OrderModule } from 'src/modules/order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CodeJudgeModule } from 'src/modules/codejudge/codejudge.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(buildConfigModuleOptions()),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService): JwtModuleOptions =>
        buildJwtModuleOptions(configService),
      inject: [ConfigService],
    }),
    PasswordModule.registerAsync({
      useFactory: (configService: ConfigService): PasswordModuleOptions =>
        buildPasswordModuleOptions(configService),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): WinstonModuleOptions =>
        buildWinstonModuleOptions(configService),
    }),
    PrismaModule,
    LoggerModule,
    AuthModule,
    UserModule,
    OrderModule,
    CodeJudgeModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}

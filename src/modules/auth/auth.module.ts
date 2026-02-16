import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtRefreshStrategy } from 'src/modules/auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { buildJwtAuthModuleOptions } from 'src/modules/infrastructure/jwt/jwt.constants';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions =>
        buildJwtAuthModuleOptions(configService),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtRefreshStrategy, AuthService],
})
export class AuthModule {}

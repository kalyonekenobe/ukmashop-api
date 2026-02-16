import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigVariables } from 'src/core/enums/app.enums';

export const buildJwtModuleOptions = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>(ConfigVariables.JwtSecret),
  signOptions: {
    audience: configService.get<string>(ConfigVariables.JwtAudience),
    issuer: configService.get<string>(ConfigVariables.JwtIssuer),
    expiresIn: configService.get<string>(ConfigVariables.JwtAccessTokenDuration),
  },
});

export const buildJwtAuthModuleOptions = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>(ConfigVariables.JwtSecret),
  signOptions: {
    audience: configService.get<string>(ConfigVariables.JwtAudience),
    issuer: configService.get<string>(ConfigVariables.JwtIssuer),
    expiresIn: configService.get<number>(ConfigVariables.JwtAccessTokenDuration),
  },
});

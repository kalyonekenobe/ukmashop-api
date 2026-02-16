import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { PasswordModuleOptions } from 'src/modules/infrastructure/password/types/password.types';

export const buildPasswordModuleOptions = (
  configService: ConfigService,
): PasswordModuleOptions => ({
  saltPrefix: configService.get<string>(ConfigVariables.UserPasswordSaltPrefix) || '',
  saltSuffix: configService.get<string>(ConfigVariables.UserPasswordSaltSuffix) || '',
  saltRounds: Number(configService.get<number>(ConfigVariables.UserPasswordSaltRounds) || 0),
});

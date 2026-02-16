import { ConfigModuleOptions } from '@nestjs/config';

export const buildConfigModuleOptions = (): ConfigModuleOptions => ({
  envFilePath: ['./env/.env.development'],
  isGlobal: true,
});

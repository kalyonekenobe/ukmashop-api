import { ConfigurableModuleBuilder } from '@nestjs/common';
import { PasswordModuleOptions } from 'src/modules/infrastructure/password/types/password.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PasswordModuleOptions>().setClassMethodName('register').build();

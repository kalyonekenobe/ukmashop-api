import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/password/password.module-definition';
import { PasswordService } from 'src/modules/infrastructure/password/password.service';

@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule extends ConfigurableModuleClass {}

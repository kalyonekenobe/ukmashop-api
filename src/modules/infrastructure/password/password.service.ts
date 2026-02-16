import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MODULE_OPTIONS_TOKEN } from 'src/modules/infrastructure/password/password.module-definition';
import type { PasswordModuleOptions } from 'src/modules/infrastructure/password/types/password.types';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: PasswordModuleOptions,
  ) {}

  public async hash(password: string): Promise<string | never> {
    return bcrypt.hash(
      `${this.options.saltPrefix}.${password}.${this.options.saltSuffix}`,
      this.options.saltRounds,
    );
  }

  public async compare(password: string, hash: string): Promise<boolean | never> {
    return bcrypt.compare(
      `${this.options.saltPrefix}.${password}.${this.options.saltSuffix}`,
      hash,
    );
  }
}

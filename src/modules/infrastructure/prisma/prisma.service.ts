import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ADAPTER_TOKEN } from 'src/modules/infrastructure/prisma/prisma.constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(ADAPTER_TOKEN) readonly adapter: PrismaPg) {
    super({ adapter });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}

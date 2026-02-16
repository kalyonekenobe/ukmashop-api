import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ADAPTER_TOKEN } from 'src/modules/infrastructure/prisma/prisma.constants';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigVariables } from 'src/core/enums/app.enums';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: ADAPTER_TOKEN,
      useFactory: (configService: ConfigService): PrismaPg => {
        const connectionString = configService.get<string>(ConfigVariables.DatabaseUrl);

        return new PrismaPg({ connectionString });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}

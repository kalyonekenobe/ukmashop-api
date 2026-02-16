import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import { ConfigVariables } from 'src/core/enums/app.enums';
import * as winston from 'winston';

export const buildWinstonModuleOptions = (configService: ConfigService): WinstonModuleOptions => ({
  transports: [
    new winston.transports.Console({
      level: configService.get<string>(ConfigVariables.DefaultLogLevel) || 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        ...(configService.get<string>(ConfigVariables.NodeEnv) === 'development'
          ? [winston.format.colorize({ all: true, level: true })]
          : []),
      ),
    }),
  ],
});

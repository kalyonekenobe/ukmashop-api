import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { ValidationException } from 'src/core/exceptions/validation.exception';
import { ExceptionUtils } from 'src/core/utils/exception.utils';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';
import winston, { Logger } from 'winston';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly loggerService: LoggerService;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    readonly configService: ConfigService,
  ) {
    this.loggerService = new LoggerService(
      new Logger({
        transports: [
          new winston.transports.Console({
            level: configService.get<string>(ConfigVariables.DefaultLogLevel) || 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json(),

              // winston.format.printf(log => {
              //   const trace = log.trace ? `\n[${log.trace}]` : '';
              //   const correlationId = log.correlationId ? `[${log.correlationId}] ` : '';
              //   const module = !log.module
              //     ? ''
              //     : configService.get<string>(ConfigVariables.NodeEnv) === 'development'
              //       ? `\x1b[33m[${log.module}]\x1b[0m`
              //       : `[${log.module}]`;

              //   return `[${log.level}] ${correlationId}${module} ${log.message} ${trace}`;
              // }),
              ...(configService.get<string>(ConfigVariables.NodeEnv) === 'development'
                ? [winston.format.colorize({ all: true, level: true })]
                : []),
            ),
          }),
        ],
      }),
    );
  }

  public catch(exception: any, host: ArgumentsHost): void {
    this.loggerService.error(exception.message, exception.stack, AllExceptionFilter.name);

    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();
    const httpException = ExceptionUtils.convertToHttpException(exception);

    let body = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
    };

    if (exception instanceof ValidationException) {
      if (
        exception.validationErrors.find(error => Object.entries(error.constraints || {}).length > 0)
      ) {
        return httpAdapter.reply(
          context.getResponse(),
          {
            errors: exception.validationErrors.flatMap(error =>
              Object.values(error.constraints || {}),
            ),
            message: httpException.getResponse(),
            ...body,
          },
          HttpStatus.CONFLICT,
        );
      }

      return httpAdapter.reply(
        context.getResponse(),
        {
          errors: exception.validationErrors.flatMap(error =>
            Object.values(error.constraints || {}),
          ),
          message: httpException.getResponse(),
          ...body,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    body = { ...body, ...(httpException.getResponse() as object) };

    httpAdapter.reply(context.getResponse(), body, httpException.getStatus());
  }
}

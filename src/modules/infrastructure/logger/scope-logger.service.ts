import { LoggerService as ILoggerService } from '@nestjs/common';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';

export class ScopeLoggerService implements ILoggerService {
  public constructor(
    private readonly loggerService: LoggerService,
    private readonly correlationId: string,
  ) {
    this.correlationId = correlationId;
  }

  public log(message: any, context?: string): void {
    this.loggerService.log(message, context, this.correlationId);
  }

  public error(message: any, trace?: string, context?: string): void {
    this.loggerService.error(message, trace, context, this.correlationId);
  }

  public warn(message: any, context?: string): void {
    this.loggerService.warn(message, context, this.correlationId);
  }

  public debug(message: any, context?: string): void {
    this.loggerService.debug(message, context, this.correlationId);
  }
}

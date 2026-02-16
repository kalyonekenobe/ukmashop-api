import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LogLevels } from 'src/core/enums/app.enums';
import { ScopeLoggerService } from 'src/modules/infrastructure/logger/scope-logger.service';
import { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  public constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly winston: Logger) {
    super();
  }

  public log(message: any, context?: string, correlationId?: string): void {
    this.winston.log(LogLevels.INFO, this.createContext(message, context, correlationId));
  }

  public error(message: any, trace?: string, context?: string, correlationId?: string): void {
    this.winston.log(LogLevels.ERROR, this.createContext(message, context, correlationId, trace));
  }

  public warn(message: any, context?: string, correlationId?: string): void {
    this.winston.log(LogLevels.WARNING, this.createContext(message, context, correlationId));
  }

  public debug(message: any, context?: string, correlationId?: string): void {
    this.winston.log(LogLevels.DEBUG, this.createContext(message, context, correlationId));
  }

  public toScopeLoggerService(correlationId: string): ScopeLoggerService {
    return new ScopeLoggerService(this, correlationId);
  }

  private createContext(
    message: any,
    context?: string,
    correlationId?: string,
    trace?: string,
  ): LogObject {
    return {
      ...(message instanceof Object ? { ...message } : { message }),
      module: (context || this.context)?.replace(/Service|Controller/i, ''),
      service: 'ukmashop-backend',
      correlationId,
      trace,
    };
  }
}

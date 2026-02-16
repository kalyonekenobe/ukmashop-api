import { Global, Module } from '@nestjs/common';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';
import { ScopeLoggerService } from 'src/modules/infrastructure/logger/scope-logger.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [LoggerService, ScopeLoggerService],
  exports: [LoggerService, ScopeLoggerService],
})
export class LoggerModule {}

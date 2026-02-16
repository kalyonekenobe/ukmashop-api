import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly dateTimeFormatter = new Intl.DateTimeFormat('sv-SE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false,
  });

  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const message = `[${req.method}] ${this.dateTimeFormatter.format(Date.now())} - ${req.originalUrl}`;
    this.loggerService.log(message, LoggerMiddleware.name, req.ip);
    next();
  }
}

import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { configureCorsAllowedOriginsList } from 'src/modules/infrastructure/app/utils/app.utils';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || '';
    const cleanIp = ip.replace('::ffff:', '');
    const whitelistedIps = (process.env.WHITELISTED_IPS || '').split(',');

    if (whitelistedIps.includes(cleanIp)) {
      return next();
    }

    const origin = req.headers.origin || req.headers.referer;

    const allowedOrigins = configureCorsAllowedOriginsList(process.env.CORS_ALLOWED_ORIGINS || '');

    if (
      req.headers['x-client-type'] !== 'mobile' &&
      !allowedOrigins.includes(origin?.toString() || '') &&
      !allowedOrigins?.includes('http://localhost')
    ) {
      throw new ForbiddenException('Origin not allowed by CORS');
    }

    res.header('Access-Control-Allow-Origin', origin?.toString() || '');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE, CONNECT',
    );
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Vary', 'Origin');

    next();
  }
}

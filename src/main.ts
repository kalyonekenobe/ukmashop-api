import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AllExceptionFilter } from 'src/core/filters/exception.filter';
import { configurePrismaDecimalJSONStringifyOutput } from 'src/core/utils/decimal.utils';
import { configurePrismaBigIntJSONStringifyOutput } from 'src/core/utils/bigint.utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/modules/infrastructure/app/app.module';
import { CorsMiddleware } from 'src/modules/infrastructure/app/middleware/cors.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BooleanOptional, IParseOptions } from 'qs';
import * as qs from 'qs';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  const loggerService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost, loggerService));

  app.set('query parser', (queryString: string | Record<string, string>) => {
    const options: IParseOptions<BooleanOptional> = {
      allowDots: true,
      depth: 10,
      parseArrays: true,
      allowEmptyArrays: true,
    };

    return qs.parse(queryString, options);
  });

  const config = new DocumentBuilder()
    .setTitle('E-Commerce Order Management API')
    .setDescription('RESTful API for managing users and orders in an e-commerce system')
    .setVersion('1.0.0')
    .setContact(
      'Contact API Support',
      'https://t.me/kalyonekenobe',
      'oleksandr.ihumnov@ukma.edu.ua',
    )
    .addServer('http://localhost/api/v1', 'Development server')
    .addServer('https://api.ukmashop.com/api/v1', 'Production server')
    .build();

  app.set('trust proxy', true);

  app.use(new CorsMiddleware().use);

  app.enableCors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE, CONNECT',
    credentials: true,
  });

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  configurePrismaDecimalJSONStringifyOutput();
  configurePrismaBigIntJSONStringifyOutput();

  if (process.env.NODE_ENV !== 'production') {
    fs.writeFileSync('./api-swagger.json', JSON.stringify(document, null, 2));
  }

  await app.listen(process.env.BACKEND_PORT || 8000);
};

bootstrap();

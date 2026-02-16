import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from 'src/core/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  public async transform(value: any, { metatype, type }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (type === 'custom') {
      return value;
    }

    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
    });

    const errors = await validate(object, {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}

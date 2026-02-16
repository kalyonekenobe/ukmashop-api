import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
  constructor(public validationErrors: ValidationError[]) {
    super('Validation failed', HttpStatus.CONFLICT);
  }
}

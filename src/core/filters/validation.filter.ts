import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { HttpStatusCode } from 'axios';
import { ValidationException } from 'src/core/exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  public catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors = this.flattenValidationErrors(exception.validationErrors);

    return response.status(HttpStatusCode.Conflict).json({
      success: false,
      data: null,
      message: 'Validation failed',
      errors,
    });
  }

  private flattenValidationErrors(
    validationErrors: ValidationError[],
    parentPath: string = '',
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const error of validationErrors) {
      const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.constraints) {
        const constraints = Object.values(error.constraints);

        errors[propertyPath] = constraints;
      }

      if (error.children && Array.isArray(error.children) && error.children.length > 0) {
        const childErrors = this.flattenValidationErrors(error.children, propertyPath);
        Object.assign(errors, childErrors);
      }
    }

    return errors;
  }
}

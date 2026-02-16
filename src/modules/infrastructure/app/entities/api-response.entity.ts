import { ApiProperty, ApiExtraModels, getSchemaPath, ApiOkResponse } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export class ApiResponseEntity<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ required: true })
  data: T | null;

  @ApiProperty({ required: false, example: 'Operation completed successfully' })
  message?: string;

  @ApiProperty({ required: false, example: { email: 'Invalid email' } })
  errors?: Record<string, string[]>;
}

export class PaginatedApiResponseEntity<T> extends ApiResponseEntity<T[]> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  totalCount: number;
}

export const ApiResponseWrapper = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseEntity, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseEntity) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export class ApiErrorResponseEntity {
  @ApiProperty({ type: String, example: '2026-02-15T21:24:28.191Z' })
  timestamp: string;

  @ApiProperty({ type: String, example: '/api/v1/endpoint' })
  path: string;

  @ApiProperty({ type: Boolean, example: false })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'An error occured on server',
  })
  message: string;

  @ApiProperty({ type: 'object', nullable: true, example: null, additionalProperties: {} })
  data: null;

  @ApiProperty({
    type: 'object',
    example: {
      server: ['An error occured on server'],
    },
    additionalProperties: {},
  })
  errors: Record<string, string[]>;
}

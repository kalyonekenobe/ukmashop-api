import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { Product } from 'generated/prisma/client';

export class ProductEntity implements Product {
  @ApiProperty({
    description: 'Unique identifier of the product (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Apple iPhone 15',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'SKU number (Stock Keeping Unit) for inventory management',
    example: 'FS-8571954',
  })
  @IsString()
  skuNumber: string;

  @ApiProperty({
    description: 'Date and time when the product was created',
    format: 'date-time',
    example: '2026-02-15T21:30:00Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the product was last updated',
    format: 'date-time',
    example: '2026-02-15T21:45:00Z',
  })
  @IsDateString()
  updatedAt: Date;
}

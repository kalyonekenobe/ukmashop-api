import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderProductDto {
  @ApiProperty({
    description: 'ID of the product being added to the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Price of the product at the time of order',
    example: '15.50',
    type: 'string',
  })
  @IsString()
  price: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Shipping address for the order',
    example: '123 Main St, Kyiv, Ukraine',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    description: 'Billing address for the order',
    example: '123 Main St, Kyiv, Ukraine',
  })
  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Leave package at the front door',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Estimated delivery date of the order',
    example: '2026-02-20T12:00:00Z',
  })
  @IsDate()
  estimatedDelivery: Date;

  @ApiProperty({
    description: 'Tax amount applied to the order',
    example: '5.50',
    type: 'string',
  })
  @IsString()
  tax: string;

  @ApiProperty({
    description: 'Shipping cost of the order',
    example: '10.00',
    type: 'string',
  })
  @IsString()
  shippingCost: string;

  @ApiProperty({
    description: 'Products included in the order',
    type: [CreateOrderProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}

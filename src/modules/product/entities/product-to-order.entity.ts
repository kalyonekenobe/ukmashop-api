import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/client';
import { ProductToOrder } from 'generated/prisma/client';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

export class ProductToOrderEntity implements ProductToOrder {
  @ApiProperty({
    description: 'Identifier of the product included in the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Identifier of the order containing the product',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Quantity of the product in the order',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Price of a single unit of the product in the order',
    example: '19.99',
    type: 'string',
  })
  price: Decimal;

  @ApiProperty({
    description: 'Date and time when the relation was created',
    example: '2026-02-15T21:30:00Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the relation was last updated',
    example: '2026-02-15T21:45:00Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description: 'The product included in the order',
    type: () => ProductEntity,
    required: false,
  })
  product?: ProductEntity;

  @ApiProperty({
    description: 'The order that includes the product',
    type: () => OrderEntity,
    required: false,
  })
  order?: OrderEntity;
}

import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { Order, OrderStatuses } from 'generated/prisma/client';
import { ProductToOrderEntity } from 'src/modules/product/entities/product-to-order.entity';

export class OrderEntity implements Order {
  @ApiProperty({
    description: 'Unique identifier of the order (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Identifier of the user who placed the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Status of the order',
    example: OrderStatuses.Pending,
  })
  status: OrderStatuses;

  @ApiProperty({
    description: 'Tax amount applied to the order',
    example: '5.50',
    type: 'string',
  })
  tax: Decimal;

  @ApiProperty({
    description: 'Shipping cost of the order',
    example: '10.00',
    type: 'string',
  })
  shippingCost: Decimal;

  @ApiProperty({
    description: 'Shipping address for the order',
    example: '123 Main St, Kyiv, Ukraine',
  })
  shippingAddress: string;

  @ApiProperty({
    description: 'Billing address for the order',
    example: '123 Main St, Kyiv, Ukraine',
  })
  billingAddress: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Leave package at the front door',
  })
  notes: string | null;

  @ApiProperty({
    description: 'Tracking number for the order shipment',
    example: 'TRACK123456789',
  })
  trackingNumber: string | null;

  @ApiProperty({
    description: 'Estimated delivery date of the order',
    example: '2026-02-20T12:00:00Z',
  })
  estimatedDelivery: Date;

  @ApiProperty({
    description: 'Date and time when the order was created',
    example: '2026-02-15T21:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the order was last updated',
    example: '2026-02-15T21:45:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Products included in the order with quantity and price details',
    type: () => [ProductToOrderEntity],
    required: false,
  })
  products?: ProductToOrderEntity[];
}

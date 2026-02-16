import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatuses } from 'generated/prisma/client';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'New status of the order',
    enum: OrderStatuses,
    example: OrderStatuses.Shipped,
    required: false,
  })
  @IsEnum(OrderStatuses)
  @IsOptional()
  status?: OrderStatuses;

  @ApiProperty({
    description: 'New shipping address',
    example: '456 Another St, Kyiv, Ukraine',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    description: 'New billing address',
    example: '456 Another St, Kyiv, Ukraine',
    required: false,
  })
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiProperty({
    description: 'Tracking number for the order shipment',
    example: 'TRACK123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string | null;

  @ApiProperty({
    description: 'Updated notes for the order',
    example: 'Leave package at the back door',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

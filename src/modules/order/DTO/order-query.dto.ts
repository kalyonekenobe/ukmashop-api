import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatuses } from 'generated/prisma/client';
import { FindAllOrdersQuery, FindOneOrderQuery } from 'src/modules/order/types/order.types';

export class FindAllOrdersQueryDto implements FindAllOrdersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(OrderStatuses, { each: true })
  statuses?: OrderStatuses[];

  @IsOptional()
  @IsString()
  shippingAddressContains?: string;

  @IsOptional()
  @IsString()
  billingAddressContains?: string;

  @IsOptional()
  @IsString()
  trackingNumberContains?: string;

  @IsOptional()
  @IsString()
  notesContains?: string;

  @IsOptional()
  @IsString()
  orderBy: string = 'createdAt';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}

export class FindOneOrderQueryDto implements FindOneOrderQuery {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(OrderStatuses)
  status?: OrderStatuses;

  @IsOptional()
  @IsString()
  shippingAddressContains?: string;

  @IsOptional()
  @IsString()
  billingAddressContains?: string;

  @IsOptional()
  @IsString()
  trackingNumberContains?: string;

  @IsOptional()
  @IsString()
  notesContains?: string;
}

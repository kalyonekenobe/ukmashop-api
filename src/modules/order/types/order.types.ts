import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderStatuses } from 'generated/prisma/client';

export interface FindAllOrdersQuery {
  ids?: OrderEntity['id'][];
  userIds?: OrderEntity['userId'][];
  statuses?: OrderStatuses[];
  shippingAddressContains?: string;
  billingAddressContains?: string;
  trackingNumberContains?: string;
  notesContains?: string;
  orderBy: string;
  page: number;
  limit: number;
}

export interface FindOneOrderQuery {
  id?: OrderEntity['id'];
  userId?: OrderEntity['userId'];
  status?: OrderStatuses;
  shippingAddressContains?: string;
  billingAddressContains?: string;
  trackingNumberContains?: string;
  notesContains?: string;
}

import { OrderStatuses } from 'generated/prisma/enums';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface FindAllUsersQuery {
  ids?: UserEntity['id'][];
  emails?: UserEntity['email'][];
  firstNames?: UserEntity['firstName'][];
  lastNames?: UserEntity['lastName'][];
  emailContains?: string;
  firstNameContains?: string;
  lastNameContains?: string;
  phoneContains?: string;
  orderBy: string;
  page: number;
  limit: number;
}

export interface FindAllUserOrdersQuery {
  ids?: OrderEntity['id'][];
  statuses?: OrderStatuses[];
  shippingAddressContains?: string;
  billingAddressContains?: string;
  trackingNumberContains?: string;
  notesContains?: string;
  orderBy: string;
  page: number;
  limit: number;
}

export interface FindAllUsersPrivateQuery extends FindAllUsersQuery {
  roles?: UserEntity['role'][];
}

export interface FindOneUserQuery {
  id?: UserEntity['id'];
  usernameContains?: string;
  emailContains?: string;
  firstNameContains?: string;
  lastNameContains?: string;
  phoneContains?: string;
}

export interface FindOneUserPrivateQuery extends FindOneUserQuery {
  role?: UserEntity['role'];
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRoles } from 'generated/prisma/enums';
import {
  OrderOrderByWithRelationInput,
  OrderWhereInput,
  UserOrderByWithRelationInput,
  UserWhereInput,
} from 'generated/prisma/models';
import * as _ from 'lodash';
import { PaginatedApiResponseEntity } from 'src/modules/infrastructure/app/entities/api-response.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { CreateUserDto } from 'src/modules/user/DTO/create-user.dto';
import { UpdateUserPrivateDto } from 'src/modules/user/DTO/update-user-private.dto';
import { UpdateUserDto } from 'src/modules/user/DTO/update-user.dto';
import {
  FindAllUserOrdersQueryDto,
  FindAllUsersPrivateQueryDto,
  FindAllUsersQueryDto,
  FindOneUserPrivateQueryDto,
  FindOneUserQueryDto,
} from 'src/modules/user/DTO/user-query.dto';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { USER_CONTROLLER_MESSAGES } from 'src/modules/user/user.constants';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findAll(
    query?: FindAllUsersQueryDto,
  ): Promise<PaginatedApiResponseEntity<UserPublicEntity>> {
    const { page = 1, limit = 10, orderBy = 'createdAt:desc', ...filters } = query || {};

    const where = this.buildWhereClause(filters);
    const orderByClause = this.buildOrderByClause(orderBy);

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      this.userRepository.findAll({
        where,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.userRepository.count({ where }),
    ]);

    return {
      success: true,
      data: users,
      page,
      limit,
      totalCount,
      message: USER_CONTROLLER_MESSAGES.FIND_ALL.USERS_SUCCESSFULLY_FETCHED.EN,
    };
  }

  public async findAllPrivate(
    query?: FindAllUsersPrivateQueryDto,
  ): Promise<PaginatedApiResponseEntity<UserEntity>> {
    const { page = 1, limit = 10, orderBy = 'createdAt:desc', ...filters } = query || {};

    const where = this.buildWhereClausePrivate(filters);
    const orderByClause = this.buildOrderByClause(orderBy);

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      this.userRepository.findAllPrivate({
        where,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.userRepository.countPrivate({ where }),
    ]);

    return {
      success: true,
      data: users,
      page,
      limit,
      totalCount,
      message: USER_CONTROLLER_MESSAGES.FIND_ALL_PRIVATE.USERS_SUCCESSFULLY_FETCHED.EN,
    };
  }

  public async findOneOrThrow(query?: FindOneUserQueryDto): Promise<UserPublicEntity> {
    const where = this.buildFindOneWhereClause(query);

    where.role = { notIn: [UserRoles.Admin] };

    try {
      return await this.userRepository.findFirstOrThrow({ where });
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: USER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.USER_NOT_FOUND.EN,
        data: null,
        errors: {
          server: USER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.USER_NOT_FOUND.EN,
        },
      });
    }
  }

  public async findOne(query?: FindOneUserQueryDto): Promise<UserPublicEntity | null> {
    const where = this.buildFindOneWhereClause(query);

    return this.userRepository.findFirst({ where });
  }

  public async findOneOrThrowPrivate(query?: FindOneUserPrivateQueryDto): Promise<UserEntity> {
    const where = this.buildFindOneWhereClausePrivate(query);

    try {
      return await this.userRepository.findFirstOrThrowPrivate({ where });
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: USER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.USER_NOT_FOUND.EN,
        data: null,
        errors: {
          server: USER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.USER_NOT_FOUND.EN,
        },
      });
    }
  }

  public async findOnePrivate(query?: FindOneUserPrivateQueryDto): Promise<UserEntity | null> {
    const where = this.buildFindOneWhereClausePrivate(query);

    return this.userRepository.findFirstOrThrowPrivate({ where });
  }

  public async create(data: CreateUserDto): Promise<UserPublicEntity> {
    return this.userRepository.create(data);
  }

  public async update(id: UserEntity['id'], data: UpdateUserDto): Promise<UserPublicEntity> {
    const _ = await this.findOneOrThrow({ id });

    return this.userRepository.update(id, data);
  }

  public async updatePrivate(
    id: UserEntity['id'],
    data: UpdateUserPrivateDto,
  ): Promise<UserPublicEntity> {
    const _ = await this.findOneOrThrowPrivate({ id });

    return this.userRepository.updatePrivate(id, data);
  }

  public async remove(id: UserEntity['id']): Promise<UserPublicEntity> {
    const user = await this.findOneOrThrowPrivate({ id });

    return this.userRepository.remove(id);
  }

  public async findAllUserOrders(
    id: UserEntity['id'],
    query?: FindAllUserOrdersQueryDto,
  ): Promise<PaginatedApiResponseEntity<OrderEntity>> {
    const { page = 1, limit = 10, orderBy = 'createdAt:desc', ...filters } = query || {};

    const where = this.buildUserOrdersWhereClause(filters);
    const orderByClause = this.buildUserOrdersOrderByClause(orderBy);

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      this.userRepository.findAllUserOrders(id, {
        where,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.userRepository.countUserOrders(id, { where }),
    ]);

    return {
      success: true,
      data: orders,
      page,
      limit,
      totalCount,
      message: USER_CONTROLLER_MESSAGES.FIND_ALL_USER_ORDERS.ORDERS_SUCCESSFULLY_FETCHED.EN,
    };
  }

  private buildWhereClause(filters: Partial<FindAllUsersQueryDto>): UserWhereInput {
    const where: UserWhereInput = {};

    if (filters.ids?.length) {
      where.id = { in: filters.ids };
    }

    if (filters.emails?.length) {
      where.email = { in: filters.emails };
    }

    if (filters.firstNames?.length) {
      where.firstName = { in: filters.firstNames.filter(firstName => firstName !== null) };
    }

    if (filters.lastNames?.length) {
      where.lastName = { in: filters.lastNames.filter(lastName => lastName !== null) };
    }

    if (filters.emailContains) {
      where.email = { contains: filters.emailContains, mode: 'insensitive' };
    }

    if (filters.firstNameContains) {
      where.firstName = { contains: filters.firstNameContains, mode: 'insensitive' };
    }

    if (filters.lastNameContains) {
      where.lastName = { contains: filters.lastNameContains, mode: 'insensitive' };
    }

    if (filters.phoneContains) {
      where.phone = { contains: filters.phoneContains, mode: 'insensitive' };
    }

    return where;
  }

  private buildWhereClausePrivate(filters: Partial<FindAllUsersPrivateQueryDto>): UserWhereInput {
    const where = this.buildWhereClause(filters);

    if (filters.roles?.length) {
      where.role = { in: filters.roles };
    }

    return where;
  }

  private buildFindOneWhereClause(query?: FindOneUserQueryDto): UserWhereInput {
    const where: UserWhereInput = {};

    if (!query) return where;

    if (query.id) {
      where.id = query.id;
    }

    if (query.emailContains) {
      where.email = { contains: query.emailContains, mode: 'insensitive' };
    }

    if (query.firstNameContains) {
      where.firstName = { contains: query.firstNameContains, mode: 'insensitive' };
    }

    if (query.lastNameContains) {
      where.lastName = { contains: query.lastNameContains, mode: 'insensitive' };
    }

    if (query.phoneContains) {
      where.phone = { contains: query.phoneContains, mode: 'insensitive' };
    }

    return where;
  }

  private buildFindOneWhereClausePrivate(query?: FindOneUserPrivateQueryDto): UserWhereInput {
    const where = this.buildFindOneWhereClause(query);

    if (query?.role) {
      where.role = query.role;
    }

    return where;
  }

  private buildOrderByClause(orderBy: string): UserOrderByWithRelationInput {
    const [field, direction] = orderBy.split(':');
    const sortDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const validFields = [
      'id',
      'email',
      'firstName',
      'phone',
      'lastName',
      'role',
      'createdAt',
      'updatedAt',
    ];

    if (!validFields.includes(field)) {
      return { createdAt: 'desc' };
    }

    return { [field]: sortDirection };
  }

  private buildUserOrdersWhereClause(filters: Partial<FindAllUserOrdersQueryDto>): OrderWhereInput {
    const where: OrderWhereInput = {};

    if (filters.ids?.length) {
      where.id = { in: filters.ids };
    }

    if (filters.statuses?.length) {
      where.status = { in: filters.statuses };
    }

    if (filters.shippingAddressContains) {
      where.shippingAddress = {
        contains: filters.shippingAddressContains,
        mode: 'insensitive',
      };
    }

    if (filters.billingAddressContains) {
      where.billingAddress = {
        contains: filters.billingAddressContains,
        mode: 'insensitive',
      };
    }

    if (filters.trackingNumberContains) {
      where.trackingNumber = {
        contains: filters.trackingNumberContains,
        mode: 'insensitive',
      };
    }

    if (filters.notesContains) {
      where.notes = {
        contains: filters.notesContains,
        mode: 'insensitive',
      };
    }

    return where;
  }

  private buildUserOrdersOrderByClause(orderBy: string): OrderOrderByWithRelationInput {
    const [field, direction] = orderBy.split(':');
    const sortDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const validFields = [
      'id',
      'status',
      'trackingNumber',
      'tax',
      'shippingCost',
      'createdAt',
      'updatedAt',
      'estimatedDelivery',
    ];

    if (!validFields.includes(field)) {
      return { createdAt: 'desc' };
    }

    return { [field]: sortDirection };
  }
}

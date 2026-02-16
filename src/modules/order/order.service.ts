import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderOrderByWithRelationInput, OrderWhereInput } from 'generated/prisma/models';
import { PaginatedApiResponseEntity } from 'src/modules/infrastructure/app/entities/api-response.entity';
import { CreateOrderDto } from 'src/modules/order/DTO/create-order.dto';
import { UpdateOrderDto } from 'src/modules/order/DTO/update-order.dto';
import { FindAllOrdersQueryDto, FindOneOrderQueryDto } from 'src/modules/order/DTO/order-query.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ORDER_CONTROLLER_MESSAGES } from 'src/modules/order/order.constants';
import { OrderRepository } from 'src/modules/order/order.repository';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async findAll(
    query?: FindAllOrdersQueryDto,
  ): Promise<PaginatedApiResponseEntity<OrderEntity>> {
    const { page = 1, limit = 10, orderBy = 'createdAt:desc', ...filters } = query || {};

    const where = this.buildWhereClause(filters);
    const orderByClause = this.buildOrderByClause(orderBy);

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      this.orderRepository.findAll({
        where,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.orderRepository.count({ where }),
    ]);

    return {
      success: true,
      data: orders,
      page,
      limit,
      totalCount,
      message: ORDER_CONTROLLER_MESSAGES.FIND_ALL.ORDERS_SUCCESSFULLY_FETCHED.EN,
    };
  }

  public async findOneOrThrow(query?: FindOneOrderQueryDto): Promise<OrderEntity> {
    const where = this.buildFindOneWhereClause(query);

    try {
      return await this.orderRepository.findFirstOrThrow({ where });
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: ORDER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.ORDER_NOT_FOUND.EN,
        data: null,
        errors: {
          server: ORDER_CONTROLLER_MESSAGES.FIND_ONE_OR_THROW.ORDER_NOT_FOUND.EN,
        },
      });
    }
  }

  public async findOne(query?: FindOneOrderQueryDto): Promise<OrderEntity | null> {
    const where = this.buildFindOneWhereClause(query);

    return this.orderRepository.findFirst({ where });
  }

  public async create(data: CreateOrderDto, user: UserPublicEntity): Promise<OrderEntity> {
    return this.orderRepository.create(data, user);
  }

  public async update(id: OrderEntity['id'], data: UpdateOrderDto): Promise<OrderEntity> {
    await this.findOneOrThrow({ id });

    return this.orderRepository.update(id, data);
  }

  public async remove(id: OrderEntity['id']): Promise<OrderEntity> {
    await this.findOneOrThrow({ id });

    return this.orderRepository.remove(id);
  }

  private buildWhereClause(filters: Partial<FindAllOrdersQueryDto>): OrderWhereInput {
    const where: OrderWhereInput = {};

    if (filters.ids?.length) {
      where.id = { in: filters.ids };
    }

    if (filters.userIds?.length) {
      where.userId = { in: filters.userIds };
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

  private buildFindOneWhereClause(query?: FindOneOrderQueryDto): OrderWhereInput {
    const where: OrderWhereInput = {};

    if (!query) return where;

    if (query.id) {
      where.id = query.id;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.shippingAddressContains) {
      where.shippingAddress = {
        contains: query.shippingAddressContains,
        mode: 'insensitive',
      };
    }

    if (query.billingAddressContains) {
      where.billingAddress = {
        contains: query.billingAddressContains,
        mode: 'insensitive',
      };
    }

    if (query.trackingNumberContains) {
      where.trackingNumber = {
        contains: query.trackingNumberContains,
        mode: 'insensitive',
      };
    }

    if (query.notesContains) {
      where.notes = {
        contains: query.notesContains,
        mode: 'insensitive',
      };
    }

    return where;
  }

  private buildOrderByClause(orderBy: string): OrderOrderByWithRelationInput {
    const [field, direction] = orderBy.split(':');
    const sortDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const validFields = [
      'id',
      'userId',
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

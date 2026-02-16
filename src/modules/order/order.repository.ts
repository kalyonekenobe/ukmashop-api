import { Injectable } from '@nestjs/common';
import {
  OrderFindFirstArgs,
  OrderFindFirstOrThrowArgs,
  OrderFindManyArgs,
  OrderCountArgs,
} from 'generated/prisma/models';
import * as _ from 'lodash';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { CreateOrderDto } from 'src/modules/order/DTO/create-order.dto';
import { UpdateOrderDto } from 'src/modules/order/DTO/update-order.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: OrderFindManyArgs): Promise<OrderEntity[]> {
    const orders = await this.prismaService.order.findMany(
      _.merge(options, {
        include: { productsToOrders: true },
      }),
    );

    return orders.map(({ productsToOrders: products, ...order }) => ({ ...order, products }));
  }

  public async findFirstOrThrow(options?: OrderFindFirstOrThrowArgs): Promise<OrderEntity> {
    const { productsToOrders: products, ...order } =
      await this.prismaService.order.findFirstOrThrow(
        _.merge(options, { include: { productsToOrders: true } }),
      );

    return { ...order, products };
  }

  public async findFirst(options?: OrderFindFirstArgs): Promise<OrderEntity | null> {
    const order = await this.prismaService.order.findFirst(
      _.merge(options, { include: { productsToOrders: true } }),
    );

    if (!order) {
      return null;
    }

    const { productsToOrders: products, ...orderWithoutProductsToOrders } = order;

    return { ...orderWithoutProductsToOrders, products: order.productsToOrders };
  }

  public async count(options?: OrderCountArgs): Promise<number> {
    return this.prismaService.order.count(options);
  }

  public async create(data: CreateOrderDto, user: UserPublicEntity): Promise<OrderEntity> {
    const { products, ...dataWithoutProducts } = data;
    const productsData = products.map(product => ({
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    }));

    const { productsToOrders, ...order } = await this.prismaService.order.create({
      data: {
        ...dataWithoutProducts,
        userId: user.id,
        productsToOrders: { create: productsData },
      },
      include: { productsToOrders: true },
    });

    return { ...order, products: productsToOrders };
  }

  public async update(id: OrderEntity['id'], data: UpdateOrderDto): Promise<OrderEntity> {
    const { productsToOrders: products, ...order } = await this.prismaService.order.update({
      where: { id },
      data,
      include: { productsToOrders: true },
    });

    return { ...order, products };
  }

  public async remove(id: OrderEntity['id']): Promise<OrderEntity> {
    const { productsToOrders: products, ...order } = await this.prismaService.order.delete({
      where: { id },
      include: { productsToOrders: true },
    });

    return { ...order, products };
  }
}

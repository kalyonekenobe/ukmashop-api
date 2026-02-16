import { Injectable } from '@nestjs/common';
import { UserRoles } from 'generated/prisma/enums';
import {
  OrderCountArgs,
  OrderFindManyArgs,
  UserCountArgs,
  UserFindFirstArgs,
  UserFindFirstOrThrowArgs,
  UserFindManyArgs,
} from 'generated/prisma/models';
import * as _ from 'lodash';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { CreateUserDto } from 'src/modules/user/DTO/create-user.dto';
import { UpdateUserPrivateDto } from 'src/modules/user/DTO/update-user-private.dto';
import { UpdateUserDto } from 'src/modules/user/DTO/update-user.dto';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(options?: UserFindManyArgs): Promise<UserPublicEntity[]> {
    return this.prismaService.user.findMany(
      _.merge(options, {
        where: { role: { not: UserRoles.Admin } },
        omit: { refreshToken: true, password: true },
      }),
    );
  }

  public async findAllPrivate(options?: UserFindManyArgs): Promise<UserEntity[]> {
    return this.prismaService.user.findMany(
      _.merge(options, { omit: { refreshToken: true, password: true } }),
    );
  }

  public async findFirstOrThrow(options?: UserFindFirstOrThrowArgs): Promise<UserPublicEntity> {
    return this.prismaService.user.findFirstOrThrow(
      _.merge(options, { omit: { refreshToken: true, password: true } }),
    );
  }

  public async findFirst(options?: UserFindFirstArgs): Promise<UserPublicEntity | null> {
    return this.prismaService.user.findFirst(
      _.merge(options, {
        where: { role: { not: UserRoles.Admin } },
        omit: { refreshToken: true, password: true },
      }),
    );
  }

  public async findFirstOrThrowPrivate(options?: UserFindFirstOrThrowArgs): Promise<UserEntity> {
    return this.prismaService.user.findFirstOrThrow(
      _.merge(options, {
        omit: { refreshToken: true, password: true },
      }),
    );
  }

  public async findFirstPrivate(options?: UserFindFirstArgs): Promise<UserEntity | null> {
    return this.prismaService.user.findFirst(
      _.merge(options, {
        omit: { refreshToken: true, password: true },
      }),
    );
  }

  public async count(options?: UserCountArgs): Promise<number> {
    return this.prismaService.user.count(
      _.merge(options, {
        where: { role: { not: UserRoles.Admin } },
      }),
    );
  }

  public async countPrivate(options?: UserCountArgs): Promise<number> {
    return this.prismaService.user.count(options);
  }

  public async create(data: CreateUserDto): Promise<UserPublicEntity> {
    return this.prismaService.user.create({
      data: data,
      omit: { refreshToken: true, password: true },
    });
  }

  public async updatePrivate(
    id: UserPublicEntity['id'],
    data: UpdateUserPrivateDto,
  ): Promise<UserPublicEntity> {
    const user = await this.prismaService.user.update({
      data,
      where: { id },
      omit: { refreshToken: true, password: true },
    });

    return user;
  }

  public async update(id: UserPublicEntity['id'], data: UpdateUserDto): Promise<UserPublicEntity> {
    const user = await this.prismaService.user.update({
      data,
      where: { id },
      omit: { refreshToken: true, password: true },
    });

    return user;
  }

  public async remove(id: UserPublicEntity['id']): Promise<UserPublicEntity> {
    return this.prismaService.user.delete({
      where: { id },
      omit: { refreshToken: true, password: true },
    });
  }

  public async findAllUserOrders(
    id: UserEntity['id'],
    options?: OrderFindManyArgs,
  ): Promise<OrderEntity[]> {
    const orders = await this.prismaService.order.findMany(
      _.merge(options, { where: { userId: id }, include: { productsToOrders: true } }),
    );

    return orders.map(({ productsToOrders: products, ...order }) => ({ ...order, products }));
  }

  public async countUserOrders(id: UserEntity['id'], options?: OrderCountArgs): Promise<number> {
    return this.prismaService.order.count(_.merge(options, { where: { userId: id } }));
  }
}

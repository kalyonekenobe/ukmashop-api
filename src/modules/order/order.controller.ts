import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OrderService } from 'src/modules/order/order.service';
import { CreateOrderDto } from 'src/modules/order/DTO/create-order.dto';
import { UpdateOrderDto } from 'src/modules/order/DTO/update-order.dto';
import { FindAllOrdersQueryDto, FindOneOrderQueryDto } from 'src/modules/order/DTO/order-query.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ORDER_CONTROLLER_MESSAGES } from 'src/modules/order/order.constants';
import { UserRoles } from 'generated/prisma/enums';
import {
  ApiErrorResponseEntity,
  ApiResponseEntity,
  PaginatedApiResponseEntity,
} from 'src/modules/infrastructure/app/entities/api-response.entity';
import { ValidationExceptionFilter } from 'src/core/filters/validation.filter';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { throwRandomException } from 'src/modules/infrastructure/app/utils/app.utils';

@ApiTags(RoutesApiTags[Routes.Orders])
@Controller(Routes.Orders)
@UseFilters(ValidationExceptionFilter)
@ApiExtraModels(ApiResponseEntity, PaginatedApiResponseEntity, OrderEntity)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'The list of orders',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedApiResponseEntity) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(OrderEntity) },
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
    type: ApiErrorResponseEntity,
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @Get()
  public async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: FindAllOrdersQueryDto,
  ): Promise<PaginatedApiResponseEntity<OrderEntity>> {
    throwRandomException(0.2);

    return this.orderService.findAll(query);
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'The order with requested id.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(OrderEntity) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
    type: ApiErrorResponseEntity,
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'The order was not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the order to be found.',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: OrderEntity['id'],
    @Query(new ValidationPipe({ transform: true }))
    query: FindOneOrderQueryDto,
  ): Promise<ApiResponseEntity<OrderEntity>> {
    throwRandomException(0.2);

    const order = await this.orderService.findOneOrThrow({ id, ...query });

    return {
      success: true,
      data: order,
      message: ORDER_CONTROLLER_MESSAGES.FIND_ONE.ORDER_SUCCESSFULLY_FETCHED.EN,
    };
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Order was successfully created.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(OrderEntity) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
    type: ApiErrorResponseEntity,
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden.',
    type: ApiErrorResponseEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create order. Invalid data provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @ApiConsumes('application/json')
  @Post()
  public async create(
    @Body() data: CreateOrderDto,
    @AuthenticatedUser() user: UserPublicEntity,
  ): Promise<ApiResponseEntity<OrderEntity>> {
    throwRandomException(0.2);

    const order = await this.orderService.create(data, user);

    return {
      success: true,
      message: ORDER_CONTROLLER_MESSAGES.CREATE.ORDER_SUCCESSFULLY_CREATED.EN,
      data: order,
    };
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'Order was successfully updated.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(OrderEntity) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
    type: ApiErrorResponseEntity,
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'Order not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot update order. Invalid data provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the order to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @ApiConsumes('application/json')
  @Put(':id')
  public async update(
    @Param('id') id: OrderEntity['id'],
    @Body() data: UpdateOrderDto,
  ): Promise<ApiResponseEntity<OrderEntity>> {
    throwRandomException(0.2);

    const updatedOrder = await this.orderService.update(id, data);

    return {
      success: true,
      message: ORDER_CONTROLLER_MESSAGES.UPDATE.ORDER_SUCCESSFULLY_UPDATED.EN,
      data: updatedOrder,
    };
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin] })
  @ApiOkResponse({
    description: 'Order was successfully removed.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(OrderEntity) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
    type: ApiErrorResponseEntity,
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'Order not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the order to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  public async remove(@Param('id') id: OrderEntity['id']): Promise<ApiResponseEntity<OrderEntity>> {
    throwRandomException(0.2);

    const removedOrder = await this.orderService.remove(id);

    return {
      success: true,
      message: ORDER_CONTROLLER_MESSAGES.REMOVE.ORDER_SUCCESSFULLY_REMOVED.EN,
      data: removedOrder,
    };
  }
}

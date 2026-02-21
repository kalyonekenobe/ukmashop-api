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
import { CreateUserDto } from 'src/modules/user/DTO/create-user.dto';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { UserService } from 'src/modules/user/user.service';
import * as _ from 'lodash';
import { UpdateUserDto } from 'src/modules/user/DTO/update-user.dto';
import { UserRoles } from 'generated/prisma/enums';
import {
  ApiErrorResponseEntity,
  ApiResponseEntity,
  PaginatedApiResponseEntity,
} from 'src/modules/infrastructure/app/entities/api-response.entity';
import { USER_CONTROLLER_MESSAGES } from 'src/modules/user/user.constants';
import {
  FindAllUserOrdersQueryDto,
  FindAllUsersPrivateQueryDto,
  FindOneUserPrivateQueryDto,
} from 'src/modules/user/DTO/user-query.dto';
import { ValidationExceptionFilter } from 'src/core/filters/validation.filter';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@ApiTags(RoutesApiTags[Routes.Users])
@Controller(Routes.Users)
@UseFilters(ValidationExceptionFilter)
@ApiExtraModels(ApiResponseEntity, PaginatedApiResponseEntity)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'The list of users',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedApiResponseEntity) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserPublicEntity) },
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
    description: 'The user is forbidden to perform this action.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @Get()
  public async findAll(
    @Query(new ValidationPipe({ transform: true })) query: FindAllUsersPrivateQueryDto,
  ): Promise<PaginatedApiResponseEntity<UserPublicEntity>> {
    return this.userService.findAllPrivate(query);
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'The user with requested id.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserPublicEntity) },
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
    description: 'The user is forbidden to perform this action.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be found.',
    type: 'uuid',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  public async findById(
    @Param('id') id: UserPublicEntity['id'],
    @Query(new ValidationPipe({ transform: true })) query: FindOneUserPrivateQueryDto,
  ): Promise<ApiResponseEntity<UserPublicEntity>> {
    const user = await this.userService.findOneOrThrowPrivate({ id, ...query });

    return {
      success: true,
      data: user,
      message: USER_CONTROLLER_MESSAGES.FIND_ONE.USER_SUCCESSFULLY_FETCHED.EN,
    };
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin] })
  @ApiCreatedResponse({
    description: 'User was successfully created.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserPublicEntity) },
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
    description: 'The user is forbidden to perform this action.',
    type: ApiErrorResponseEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create user. Invalid data was provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error has occured.',
    type: ApiErrorResponseEntity,
  })
  @ApiConsumes('application/json')
  @Post()
  public async create(@Body() data: CreateUserDto): Promise<ApiResponseEntity<UserPublicEntity>> {
    const user = await this.userService.create(data);

    return {
      success: true,
      message: USER_CONTROLLER_MESSAGES.CREATE.USER_SUCCESSFULLY_CREATED.EN,
      data: user,
    };
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin, UserRoles.Manager] })
  @ApiOkResponse({
    description: 'User was successfully updated.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserPublicEntity) },
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
    description: 'The user is forbidden to perform this action.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot update user. Invalid data was provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @ApiConsumes('application/json')
  @Put(':id')
  public async update(
    @Param('id') id: UserPublicEntity['id'],
    @Body() data: UpdateUserDto,
  ): Promise<ApiResponseEntity<UserPublicEntity>> {
    const updatedUser = await this.userService.updatePrivate(id, data);

    return {
      success: true,
      message: USER_CONTROLLER_MESSAGES.UPDATE.USER_SUCCESSFULLY_UPDATED.EN,
      data: updatedUser,
    };
  }

  @Auth(JwtAuthGuard, { requiredRoles: [UserRoles.Admin] })
  @ApiOkResponse({
    description: 'User was successfully removed.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseEntity) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserPublicEntity) },
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
    description: 'The user is forbidden to perform this action.',
    type: ApiErrorResponseEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  public async remove(
    @Param('id') id: UserPublicEntity['id'],
  ): Promise<ApiResponseEntity<UserPublicEntity>> {
    const removedUser = await this.userService.remove(id);

    return {
      success: true,
      message: USER_CONTROLLER_MESSAGES.REMOVE.USER_SUCCESSFULLY_REMOVED.EN,
      data: removedUser,
    };
  }

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
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
    type: ApiErrorResponseEntity,
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be found.',
    type: 'uuid',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/orders')
  public async findAllUserOrders(
    @Param('id') id: UserPublicEntity['id'],
    @Query(new ValidationPipe({ transform: true }))
    query: FindAllUserOrdersQueryDto,
  ): Promise<PaginatedApiResponseEntity<OrderEntity>> {
    return this.userService.findAllUserOrders(id, query);
  }
}

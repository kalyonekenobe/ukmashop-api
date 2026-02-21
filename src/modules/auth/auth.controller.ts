import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ConfigVariables, Routes } from 'src/core/enums/app.enums';
import { RoutesApiTags } from 'src/core/constants';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/core/decorators/auth.decorator';
import { AuthenticatedUser } from 'src/core/decorators/authenticated-user.decorator';
import {
  ApiErrorResponseEntity,
  ApiResponseEntity,
} from 'src/modules/infrastructure/app/entities/api-response.entity';
import { AUTH_CONTROLLER_MESSAGES } from 'src/modules/auth/auth.constants';
import { ValidationExceptionFilter } from 'src/core/filters/validation.filter';
import { LoginDto } from 'src/modules/auth/DTO/login.dto';

@ApiTags(RoutesApiTags[Routes.Auth])
@Controller(Routes.Auth)
@UseFilters(ValidationExceptionFilter)
@ApiExtraModels(ApiResponseEntity, UserPublicEntity)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The authenticated user.',
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @Get('/user')
  public async user(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
  ): Promise<ApiResponseEntity<UserPublicEntity>> {
    return {
      success: true,
      message: AUTH_CONTROLLER_MESSAGES.GET_AUTHENTICATED_USER.USER_SUCCESSFULLY_FETCHED.EN,
      data: authenticatedUser,
    };
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in.',
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
  @ApiUnauthorizedResponse({ description: 'Cannot log in the user.', type: ApiErrorResponseEntity })
  @ApiConflictResponse({
    description: 'Cannot log in the user. Invalid data was provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @Post('/login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response<ApiResponseEntity<UserPublicEntity>>> {
    const { accessToken, refreshToken, ...user } = await this.authService.login(loginDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieAccessTokenName) ||
          'Ukmashop-Access-Token',
        accessToken,
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieRefreshTokenName) ||
          'Ukmashop-Refresh-Token',
        refreshToken,
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .json({
        success: true,
        message: AUTH_CONTROLLER_MESSAGES.LOGIN.USER_WAS_SUCCESSFULLY_LOGGED_IN.EN,
        data: user,
      } as ApiResponseEntity<UserPublicEntity>);
  }

  @Auth(JwtRefreshAuthGuard)
  @ApiCreatedResponse({
    description: 'User refresh and access tokens were successfully updated.',
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
    description: "Cannot update user's refresh and access tokens. Invalid data was provided.",
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @Post('/refresh')
  public async refresh(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<ApiResponseEntity<UserPublicEntity>>> {
    const { accessToken, refreshToken } = await this.authService.refresh(
      request.cookies[
        this.configService.get<string>(ConfigVariables.CookieRefreshTokenName) ||
          'Ukmashop-Refresh-Token'
      ],
    );

    return response
      .status(HttpStatus.CREATED)
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieAccessTokenName) ||
          'Ukmashop-Access-Token',
        accessToken,
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .cookie(
        this.configService.get<string>(ConfigVariables.CookieRefreshTokenName) ||
          'Ukmashop-Refresh-Token',
        refreshToken,
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .json({
        success: true,
        message: AUTH_CONTROLLER_MESSAGES.REFRESH.USER_JWT_TOKENS_SUCCESSFULLY_REFRESHED.EN,
        data: authenticatedUser,
      } as ApiResponseEntity<UserPublicEntity>);
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The user was successfully logged out.',
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
    description: 'Cannot log out the user. Invalid data was provided.',
    type: ApiErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
    type: ApiErrorResponseEntity,
  })
  @Delete('/logout')
  public async logout(
    @AuthenticatedUser() authenticatedUser: UserPublicEntity,
    @Res() response: Response,
  ): Promise<Response<ApiResponseEntity<UserPublicEntity>>> {
    const user = await this.authService.logout(authenticatedUser.id);

    return response
      .status(HttpStatus.CREATED)
      .clearCookie(
        this.configService.get<string>(ConfigVariables.CookieAccessTokenName) ||
          'Ukmashop-Access-Token',
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .clearCookie(
        this.configService.get<string>(ConfigVariables.CookieRefreshTokenName) ||
          'Ukmashop-Refresh-Token',
        {
          httpOnly: true,
          domain: this.configService.get<string>(ConfigVariables.CookieDomain),
        },
      )
      .json({
        success: true,
        message: AUTH_CONTROLLER_MESSAGES.LOGOUT.USER_WAS_SUCCESSFULLY_LOGGED_OUT.EN,
        data: user,
      } as ApiResponseEntity<UserPublicEntity>);
  }
}

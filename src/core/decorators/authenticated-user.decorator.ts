import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AUTH_CONTROLLER_MESSAGES } from 'src/modules/auth/auth.constants';
import { ApiResponseEntity } from 'src/modules/infrastructure/app/entities/api-response.entity';

export const AuthenticatedUser = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    throw new UnauthorizedException({
      success: false,
      message: AUTH_CONTROLLER_MESSAGES.GENERAL.UNAUTHORIZED.EN,
      data: null,
      errors: {
        server: [AUTH_CONTROLLER_MESSAGES.GENERAL.UNAUTHORIZED.EN],
      },
    } as ApiResponseEntity<null>);
  }

  return user;
});

export const OptionalAuthenticatedUser = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return user;
});

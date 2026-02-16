import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_CONTROLLER_MESSAGES } from 'src/modules/auth/auth.constants';
import { AuthGuardOptions } from 'src/modules/auth/types/auth.types';
import { ApiResponseEntity } from 'src/modules/infrastructure/app/entities/api-response.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly options?: AuthGuardOptions) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canBeActivated = await super.canActivate(context);

      if (!canBeActivated) {
        if (this.options?.optional) {
          return true;
        }

        return false;
      }

      if (!this.options) {
        return true;
      }

      const request = context.switchToHttp().getRequest();

      if (!request.user) {
        return this.options?.optional || false;
      }

      const { password, refreshToken, ...user } = request.user;
      request.user = user;

      const hasRequiredRole = this.options.requiredRoles
        ? this.options.requiredRoles.includes(user.role)
        : true;

      return hasRequiredRole;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException({
          success: false,
          message: error.message,
          data: null,
          errors: {
            server: [error.message],
          },
        } as ApiResponseEntity<null>);
      }

      throw new ForbiddenException({
        success: false,
        message: AUTH_CONTROLLER_MESSAGES.GENERAL.FORBIDDEN_RESOURCE.EN,
        data: null,
        errors: {
          server: [AUTH_CONTROLLER_MESSAGES.GENERAL.FORBIDDEN_RESOURCE.EN],
        },
      } as ApiResponseEntity<null>);
    }
  }

  public handleRequest(error: any, user: any, _info: any, _context: ExecutionContext) {
    const { password, refreshToken, ...authenticatedUser } = user;

    if (this.options?.optional) {
      if (error || !user || !authenticatedUser) {
        return null;
      }

      return authenticatedUser;
    }

    if (!user || !authenticatedUser) {
      throw (
        error ||
        new UnauthorizedException({
          success: false,
          message: AUTH_CONTROLLER_MESSAGES.GENERAL.UNAUTHORIZED.EN,
          data: null,
          errors: {
            server: [AUTH_CONTROLLER_MESSAGES.GENERAL.UNAUTHORIZED.EN],
          },
        } as ApiResponseEntity<null>)
      );
    }

    return authenticatedUser;
  }
}

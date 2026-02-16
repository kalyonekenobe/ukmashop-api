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
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly options?: AuthGuardOptions) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canBeActivated = await super.canActivate(context);

      if (!canBeActivated) {
        return false;
      }

      if (!this.options) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { role } = request.user;

      const hasRequiredRole = this.options.requiredRoles
        ? this.options.requiredRoles.includes(role)
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
}

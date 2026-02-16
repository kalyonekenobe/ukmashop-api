import { UserRoles } from 'generated/prisma/enums';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface LoginResponse extends Omit<UserEntity, 'refreshToken' | 'password'> {
  [key: string]: any;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokensPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokenPayload {
  userId: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface AuthGuardOptions {
  requiredRoles?: UserRoles[];
  optional?: boolean;
}

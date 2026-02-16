import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { AuthException } from 'src/core/exceptions/auth.exception';
import { ConfigVariables } from 'src/core/enums/app.enums';
import {
  JwtTokensPairResponse,
  LoginResponse,
  RefreshTokensResponse,
} from 'src/modules/auth/types/auth.types';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { LoginDto } from 'src/modules/auth/DTO/login.dto';
import { PasswordService } from 'src/modules/infrastructure/password/password.service';
import { AUTH_CONTROLLER_MESSAGES } from 'src/modules/auth/auth.constants';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
  ) {}

  public async validateUser(credentials: LoginDto): Promise<UserPublicEntity> {
    try {
      const { email, password } = credentials;

      const user = await this.prismaService.user.findFirstOrThrow({
        where: { email },
      });

      if (!password || !user.password) {
        throw new AuthException('Cannot authenticate the user. Invalid credentials were provided');
      }

      const isPasswordValid = await this.passwordService.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthException('Cannot authenticate the user. Invalid credentials were provided');
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException(
        'The provided credentials are invalid. Please verify your email and password and try again.',
      );
    }
  }

  public async login(data: LoginDto): Promise<LoginResponse> {
    try {
      await this.validateUser(data);

      const user = await this.userRepository.findFirstPrivate({
        where: { email: data.email },
      });

      if (!user) {
        throw new AuthException(
          'The provided credentials are invalid. Please verify your email and password and try again.',
        );
      }

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userRepository.updatePrivate(user.id, { refreshToken });

      return { ...user, lastLoginAt: new Date(), accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new UnauthorizedException({
        success: false,
        message: AUTH_CONTROLLER_MESSAGES.LOGIN.LOGIN_WITH_CREDENTIALS_ERROR.EN,
        data: null,
        errors: {
          server: AUTH_CONTROLLER_MESSAGES.LOGIN.LOGIN_WITH_CREDENTIALS_ERROR.EN,
        },
      });
    }
  }

  public async refresh(token: string): Promise<RefreshTokensResponse> {
    const userWithValidRefreshToken = await this.userRepository.findFirstOrThrow({
      where: { refreshToken: token },
    });
    const { accessToken, refreshToken } =
      await this.generateJwtTokensPair(userWithValidRefreshToken);

    await this.userRepository.updatePrivate(userWithValidRefreshToken.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  public async logout(userId: UserEntity['id']): Promise<UserPublicEntity> {
    return this.userRepository.updatePrivate(userId, { refreshToken: null });
  }

  private async generateJwtTokensPair(user: UserPublicEntity): Promise<JwtTokensPairResponse> {
    const accessToken = this.jwtService.sign(
      {
        iat: Number((Date.now() / 1000).toFixed(0)),
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: this.configService.get<string>(ConfigVariables.JwtAccessTokenDuration) },
    );

    const refreshToken = this.jwtService.sign(
      {
        iat: Number((Date.now() / 1000).toFixed(0)),
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: this.configService.get<string>(ConfigVariables.JwtRefreshTokenDuration) },
    );

    return { accessToken, refreshToken };
  }
}

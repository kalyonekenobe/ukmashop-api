import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from 'src/modules/auth/types/auth.types';
import { UserPublicEntity } from 'src/modules/user/entities/user-public.entity';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies[
            configService.get<string>(ConfigVariables.CookieAccessTokenName) ||
              'Ukmashop-Access-Token'
          ] || request.headers.authorization?.replace('Bearer ', ''),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigVariables.JwtSecret) || '',
      passReqToCallback: true,
    });
  }

  public async validate(_request: Request, payload: JwtTokenPayload): Promise<UserPublicEntity> {
    return this.userRepository.findFirstOrThrowPrivate({
      where: { id: payload.userId },
      omit: { refreshToken: true, password: true },
    });
  }
}

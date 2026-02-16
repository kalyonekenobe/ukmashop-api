import { CanActivate, UseGuards } from '@nestjs/common';
import { AuthGuardOptions } from 'src/modules/auth/types/auth.types';

export const Auth = (guard: Function | CanActivate, options?: AuthGuardOptions) => {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<unknown>) => {
    const guardInstance = guard instanceof Function ? new (guard as any)(options) : guard;
    UseGuards(guardInstance)(target, key, descriptor);
  };
};

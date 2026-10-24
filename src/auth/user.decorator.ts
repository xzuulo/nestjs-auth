import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from '../users/user.types.js';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserType => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

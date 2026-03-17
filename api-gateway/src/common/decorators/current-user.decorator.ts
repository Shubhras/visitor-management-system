import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Pulls the authenticated user object off the request so controllers
// can access the logged-in user without digging into req.user manually.
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
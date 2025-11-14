import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);
    // return the payload that get from validate func in the Auth Strategy
    //  { userId: payload.sub, role: payload.role };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.user;
  },
);

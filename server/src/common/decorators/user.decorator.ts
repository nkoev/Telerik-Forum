import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (_, request) => {
    return request.user;
  }
);
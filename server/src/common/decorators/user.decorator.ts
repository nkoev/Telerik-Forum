import { createParamDecorator } from '@nestjs/common';
import { UserShowDTO } from '../../models/users/user-show.dto';

export const User = createParamDecorator(
  (_, request): UserShowDTO => {
    return request.user;
  }
);
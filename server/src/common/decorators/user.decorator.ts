import { createParamDecorator } from '@nestjs/common';
import { ShowUserDTO } from '../../models/users/show-user.dto';

export const User = createParamDecorator(
  (_, request): ShowUserDTO => {
    return request.user;
  }
);
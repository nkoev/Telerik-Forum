import { createParamDecorator } from '@nestjs/common';

export const IsAdmin = createParamDecorator(
    (_, request): boolean => {
        return request.user.roles.some(role => role.name === 'Admin');
    }
);
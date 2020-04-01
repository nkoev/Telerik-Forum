import { SetMetadata } from '@nestjs/common';

export const AccessLevel = (role: string) => SetMetadata('role', role);
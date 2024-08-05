import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => {
    console.log('decorator add metadata');

    return SetMetadata('roles', roles)};

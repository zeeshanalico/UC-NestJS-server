import { SetMetadata } from '@nestjs/common';
export const IS_IGNORE = 'ignoreResponseInterceptor';
export const IgnoreResponseInterceptor = () => SetMetadata(IS_IGNORE, true);

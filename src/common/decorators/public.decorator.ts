// import { SetMetadata } from '@nestjs/common';
// export const Public = (status: string) => {
//     console.log('decorator add metadata');

//     return SetMetadata('status', status)
// };



import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
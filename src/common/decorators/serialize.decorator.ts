import { UseInterceptors } from '@nestjs/common';
 import { ClassConstructor,SerializeInterceptor } from '../Interceptors/serialize.interceptor';
 //here we used custom interceptor in custom decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
 
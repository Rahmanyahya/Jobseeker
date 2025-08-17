import { ZodType } from 'zod';
export class Validator {
  static Validate<T>(schema: ZodType, data: T): T {
    return schema.parse(data) as T;
  }
}

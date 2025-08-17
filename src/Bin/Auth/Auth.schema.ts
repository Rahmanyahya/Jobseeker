import z, { ZodType } from 'zod';

export class AuthSchema {
  static readonly LOGIN: ZodType = z.object({
    email: z.email(),
    password: z.string(),
  });
}

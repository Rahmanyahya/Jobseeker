import z, { ZodType } from 'zod';

export class CompanySchema {
  static readonly CREATE_COMPANY = z.object({
    userId: z.number(),
    name: z.string().min(5),
    address: z.string(),
    phone: z.string().min(12).max(12),
    description: z.string(),
  });

  static readonly UPDATE_COMPANY = this.CREATE_COMPANY.omit({
    userId: true,
  })
    .partial()
    .extend({
      userId: z.number(),
    });

  static readonly GET_COMPANY: ZodType = z.object({
    userId: z.number(),
  });
}

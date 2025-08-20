import z, { ZodType } from 'zod';

export class AccountSchema {
  static readonly ADD_PROFILE: ZodType = z.object({
    address: z.string(),
    phone: z.string().min(12).max(12),
    dob: z.string().transform(date => {
      const newDate = new Date(date);

      if (newDate.getTime() > Date.now()) {
        throw new Error('Date of birth cannot be in the future');
      }

      return newDate;
    }),
    gender: z.enum(['L', 'P']),
  });

  static readonly REGISTER: ZodType = z.object({
    email: z.email(),
    password: z.string().min(8).max(255),
    role: z.enum(['SOCIETY', 'HRD']),
    name: z.string().min(5).max(255),
  });

  static readonly EDIT_PROFILE: ZodType = z.object({
    email: z.email().optional(),
    name: z.string().min(5).max(255).optional(),
    password: z.string().min(8).max(255).optional(),
    address: z.string().optional(),
    phone: z.string().min(12).max(12).optional(),
    dob: z
      .string()
      .transform(date => {
        const newDate = new Date(date);

        if (newDate.getTime() > Date.now())
          throw new Error('Date of birth cannot be in the future');

        return newDate;
      })
      .optional(),
    gender: z.enum(['L', 'P']).optional(),
  });
}

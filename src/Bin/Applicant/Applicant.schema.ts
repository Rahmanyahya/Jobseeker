import z, { ZodType } from 'zod';

export class ApplicantSchema {
  static readonly APPLY_JOB: ZodType = z.object({
    avaible_position_id: z.number(),
  });

  static readonly CANCEL_APPLY: ZodType = z.object({
    id: z.number(),
  });

  static readonly GET_HISTORY_APPLYCIANT: ZodType = z.object({
    page: z.number().positive().default(1),
    quantity: z.number().positive().default(10),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
    search: z.string().optional(),
    applyDate: z
      .string()
      .transform(value => new Date(value))
      .optional(),
  });

  static readonly EDIT_APPLICANT: ZodType = z.object({
    id: z.number(),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  });

  static readonly APPLICANT_DETAILS: ZodType = z.object({
    id: z.number(),
  });

  static readonly JOB_APPLICANT_LIST: ZodType = z.object({
    avaible_position_Id: z.number(),
    page: z.number().positive().default(1),
    quantity: z.number().positive().default(10),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
    search: z.string().optional(),
    applyDate: z
      .string()
      .transform(value => new Date(value))
      .optional(),
  });
}

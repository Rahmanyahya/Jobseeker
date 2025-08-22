import z from 'zod';

export class JobSchema {
  static readonly ADD_JOB = z.object({
    position_name: z.string(),
    capacity: z.number().positive(),
    description: z.string(),
    submition_start_date: z.string().transform(date => new Date(date)),
    submition_end_date: z.string().transform(date => new Date(date)),
  });

  static readonly UPDATE_JOB = this.ADD_JOB.partial().extend({
    id: z.number(),
  });

  static readonly GET_JOB_BY_ID = z.object({
    id: z.number(),
    userId: z.number().optional(),
  });

  static readonly GET_ALL_JOB = z.object({
    offset: z.number().min(0),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    skill: z.array(z.string()).optional(),
  });

  static readonly DELETE_JOB = this.GET_JOB_BY_ID;
}

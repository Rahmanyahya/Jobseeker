import z, { ZodType } from 'zod';

export class PortfolioSchema {
  static readonly ADD_PORTFOLIO = z.object({
    userId: z.number(),
    skill: z.string(),
    description: z.string(),
  });

  static readonly UPDATE_PORTFOLIO = this.ADD_PORTFOLIO.omit({
    userId: true,
  }).extend({
    id: z.number(),
  });

  static readonly GET_PORTFOLIO_BY_ID = z.object({
    id: z.number(),
  });

  static readonly GET_ALL_PORTFOLIO: ZodType = z.object({
    userId: z.number(),
    page: z.number(),
    quantity: z.number(),
    search: z.string().optional(),
  });

  static readonly DELETE_PORTFOLIO = this.GET_PORTFOLIO_BY_ID;
}

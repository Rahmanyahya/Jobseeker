import { ROLE } from '@prisma/client';
import { Request } from 'express';

export class ErrorHandler extends Error {
  constructor(
    public code: number,
    public message: string
  ) {
    super(message);
  }
}

export interface ClientRequest extends Request {
  user?: {
    id?: number;
    role?: ROLE;
  };
}

export type JwtPayload = {
  id: number;
  role: ROLE;
};

export type MetaData = {
  page: number;
  quantity: number;
  total: number;
  totalPage: number;
  currentPage: number;
};

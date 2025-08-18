import { ROLE } from '@prisma/client';
import { ClientRequest } from '../Global/Global';
import { NextFunction, Response, RequestHandler } from 'express';

export const AuthorizationMiddleware = (...allowedRoles: ROLE[]): RequestHandler => {
  return (req: ClientRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role!)) {
      return res.status(403).json({ success: false, data: [], message: 'Not Allowed' });
    } else {
      next();
    }
  };
};

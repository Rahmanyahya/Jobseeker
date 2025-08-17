import { ROLE } from "@prisma/client";
import { ClientRequest } from "../Global/Global";
import { NextFunction, Response } from "express";

export const AuthorizationMiddleware = (...allowedRoles: ROLE[]): unknown => {
    return (req: ClientRequest, res: Response, next: NextFunction): void => {
      if (!req.user || !allowedRoles.includes(req.user.role!)) {
        res.status(403).json({ success: false, data: [], message: 'Not Allowed' });
      } else {
        next();
      }
    };
};
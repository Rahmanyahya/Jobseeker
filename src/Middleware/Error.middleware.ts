import { NextFunction, Response } from "express";
import { ClientRequest, ErrorHandler } from "../Global/Global";
import { ZodError } from "zod";

export const ErrorMiddleware = (err: Error, req: ClientRequest, res: Response, next: NextFunction): void => {
    if (err instanceof ErrorHandler) {  
        res.status(err.code).json({
            success: false,
            data: [],
            message: err.message,
          });
    } else if (err instanceof ZodError) {
        const errors = err.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          }));
      
          res.status(400).json({
            success: false,
            data: [],
            message: errors
          });
    } else {
        res.status(500).json({
            success: false,
            data: [],
            message: 'Something went wrong',
          });
    }
}   
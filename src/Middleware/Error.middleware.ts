import { NextFunction, Response } from 'express';
import { ClientRequest, ErrorHandler } from '../Global/Global';
import { ZodError } from 'zod';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';

export const ErrorMiddleware = (
  err: Error,
  req: ClientRequest,
  res: Response,
  next: NextFunction
): void => {
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

    res.status(HttpErrorCode.BAD_REQUEST).json({
      success: false,
      data: [],
      errors,
    });
  } else {
    res.status(HttpErrorCode.SERVER_ERROR).json({
      success: false,
      data: [],
      message: HttpErrorMessage.SERVER_ERROR,
    });
  }
};

import { Response } from 'express';

export class Wrapper {
  static success<T>(res: Response, data: T, message: string, code: number = 200): Response {
    return res.status(code).json({ success: true, data, message });
  }

  static pagination<T>(
    res: Response,
    data: T,
    metaData: object,
    message: string,
    code: number = 200
  ): Response {
    return res.status(code).json({ success: true, data, metaData, message });
  }
}

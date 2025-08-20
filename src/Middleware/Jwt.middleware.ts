import { initialRedisClient } from 'Config/Redis';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import { NextFunction, Response } from 'express';
import { ClientRequest, ErrorHandler, JwtPayload } from 'Global/Global';
import * as Jwt from 'jsonwebtoken';

export const JwtMiddleware = async (req: ClientRequest, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization?.split(' ')[1] as string;

  if (!token)
    return res.status(HttpErrorCode.UNAUTHORIZED).json({ message: HttpErrorMessage.UNAUTHORIZED });

  Jwt.verify(token, process.env.JWT_SECRET as string, async (err, decode) => {
    if (err)
      return res
        .status(HttpErrorCode.UNAUTHORIZED)
        .json({ message: HttpErrorMessage.UNAUTHORIZED });

    req.user = decode as JwtPayload;

    const redisClient = initialRedisClient();

    const isTokenActive = await redisClient.get(`token:${req.user.id}`);

    if (!isTokenActive)
      return res
        .status(HttpErrorCode.UNAUTHORIZED)
        .json({ message: HttpErrorMessage.UNAUTHORIZED });

    next();
  });
};

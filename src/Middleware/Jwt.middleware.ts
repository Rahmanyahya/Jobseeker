import { NextFunction, Response } from "express";
import { ClientRequest, JwtPayload } from "../Global/Global";
import * as Jwt from "jsonwebtoken";

export const JwtMiddleware = async (req: ClientRequest, res: Response, next: NextFunction): Promise<void> => {
    const token: string = req.headers.authorization?.split(' ')[1] as string;

    if (!token) res.status(401).json({ success: false, data: [], message: 'Unauthorized' });
    
    Jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
        if (err) res.status(401).json({ success: false, data: [], message: 'Unauthorized' });
       
        req.user = decode as JwtPayload
    });

    next()
}   
import { GlobalEnv } from "../Config/GlobalEnv";
import { initialRedisClient } from "../Config/Redis";
import { JwtPayload } from "../Global/Global";
import * as Jwt from "jsonwebtoken";

export class JwtService {

    static async createToken(payload: JwtPayload): Promise<string> {
        const redisClient = initialRedisClient();

        const token = Jwt.sign(payload, GlobalEnv.JWT_SECRET as string, { expiresIn: '1d' });

        await redisClient.setex(`token:${payload.id}`, token, 60 * 60 * 24);

        return token
    }

}
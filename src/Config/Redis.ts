import Redis from 'ioredis';
import { GlobalEnv } from '../Config/GlobalEnv';
import Logger from '../Config/Logger';

let client: Redis | null = null;

export function initialRedisClient(): Redis {
  if (!client) {
    client = new Redis({
      host: 'localhost',
      port: 6379,
      username: GlobalEnv.REDIS.USERNAME,
      password: GlobalEnv.REDIS.PASSWORD,
      db: 0,
    });

    client.on('error', (error: Error) => {
      Logger.error('Redis Connection', error.toString(), 'Redis');
    });

    client.on('connect', () => {
      Logger.info('Redis connection', 'Success connect redis server', 'Redis');
    });
  }

  return client;
}

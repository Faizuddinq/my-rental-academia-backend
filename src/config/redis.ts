import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
//redis client
export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || '', {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      connectTimeout: 10000,
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });
  }
  return redisClient;
};

export const closeRedisConnection = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}; 
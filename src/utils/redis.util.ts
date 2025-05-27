import Redis from 'ioredis';

import { logger } from './logger';


let redisClient: Redis | null = null;
const REDIS_ENABLED = String(process.env.REDIS_ENABLED).trim().toLowerCase();

// Only initialize Redis if REDIS_ENABLED is true
// if (REDIS_ENABLED === "true") {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (error: Error) => {
    logger.error('Redis Client Error:', error);
  });

  redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
  });
// } else {
//   logger.info('Redis is disabled. Running without cache.');
// }

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  if (!redisClient) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis getCachedData Error:', error);
    return null;
  }
};

export const setCachedData = async (
  key: string,
  data: any,
  expirationInSeconds = 3600
): Promise<void> => {
  if (!redisClient) return;

  try {
    await redisClient.setex(key, expirationInSeconds, JSON.stringify(data));
  } catch (error) {
    logger.error('Redis setCachedData Error:', error);
  }
};

export const deleteCachedData = async (key: string): Promise<void> => {
  if (!redisClient) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Redis deleteCachedData Error:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  if (!redisClient) return;

  try {
    await redisClient.flushall();
  } catch (error) {
    logger.error('Redis Clear Cache Error:', error);
  }
};

export default redisClient;

import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IRedisMiddlewareContext, TNext } from "../types";

export const redisMiddleware = (options: IRedisConnectionOptions) => async (
  ctx: IRedisMiddlewareContext,
  next: TNext,
): Promise<void> => {
  const start = Date.now();

  ctx.redis = new RedisConnection(options);

  await ctx.redis.connect();

  ctx.logger.debug("redis connection established");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    redisConnection: Date.now() - start,
  };

  try {
    await next();
  } finally {
    await ctx.redis.disconnect();
  }
};

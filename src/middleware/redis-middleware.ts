import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";
import { IRedisMiddlewareContext } from "../types";
import { TPromise } from "@lindorm-io/core";

export const redisMiddleware = (options: IRedisConnectionOptions) => async (
  ctx: IRedisMiddlewareContext,
  next: TPromise<void>,
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

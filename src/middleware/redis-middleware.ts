import { IRedisMiddlewareContext, IRedisMiddlewareOptions } from "../types";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { TPromise } from "@lindorm-io/core";

export const redisMiddleware = (options: IRedisMiddlewareOptions) => async (
  ctx: IRedisMiddlewareContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  ctx.redis = new RedisConnection(options);

  await ctx.redis.connect();

  if (options.type === RedisConnectionType.MEMORY && options.clientRef) {
    options.clientRef(ctx.redis.getClient());
    ctx.logger.debug("redis client ref called");
  }

  ctx.logger.debug("redis connection established");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    redisConnection: Date.now() - start,
  };

  try {
    await next();
  } finally {
    if (options.type !== RedisConnectionType.MEMORY) {
      await ctx.redis.disconnect();
    }
  }
};

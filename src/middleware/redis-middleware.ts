import { Middleware } from "@lindorm-io/koa";
import { RedisConnection, RedisConnectionOptions } from "@lindorm-io/redis";
import { RedisContext } from "../types";

export const redisMiddleware =
  (options: RedisConnectionOptions): Middleware<RedisContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.client.redis = new RedisConnection(options);

    await ctx.client.redis.connect();

    ctx.logger.debug("redis connection established");

    ctx.metrics.redis = (ctx.metrics.redis || 0) + (Date.now() - start);

    try {
      await next();
    } finally {
      await ctx.client.redis.disconnect();
    }
  };

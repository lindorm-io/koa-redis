import { Middleware } from "@lindorm-io/koa";
import { RedisConnection, RedisConnectionOptions } from "@lindorm-io/redis";
import { RedisContext } from "../types";

export const redisMiddleware =
  (options: RedisConnectionOptions): Middleware<RedisContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("redis");

    ctx.client.redis = new RedisConnection(options);

    await ctx.client.redis.connect();

    ctx.logger.debug("redis connection established");

    metric.end();

    try {
      await next();
    } finally {
      await ctx.client.redis.disconnect();
    }
  };

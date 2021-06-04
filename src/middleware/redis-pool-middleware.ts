import { Middleware } from "@lindorm-io/koa";
import { RedisConnection } from "@lindorm-io/redis";
import { RedisContext } from "../types";

export const redisPoolMiddleware =
  (redis: RedisConnection): Middleware<RedisContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    if (!redis.isConnected()) {
      await redis.connect();
    }

    ctx.client.redis = redis;

    ctx.logger.debug("redis connection added to context");

    ctx.metrics.redis = (ctx.metrics.redis || 0) + (Date.now() - start);

    await next();
  };

import { DefaultState, Middleware } from "koa";
import { IKoaRedisContext } from "../types";
import { IRedisConnectionOptions, RedisConnection } from "@lindorm-io/redis";

export const redisMiddleware =
  (options: IRedisConnectionOptions): Middleware<DefaultState, IKoaRedisContext> =>
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

import { Middleware } from "@lindorm-io/koa";
import { RedisCache } from "@lindorm-io/redis";
import { RedisContext } from "../types";
import { camelCase } from "lodash";

interface CacheMiddlewareOptions {
  key?: string;
  expiresInSeconds?: number;
}

export const cacheMiddleware =
  (Cache: typeof RedisCache, options?: CacheMiddlewareOptions): Middleware<RedisContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("redis");

    /*
     * Ignoring TS here since Cache needs to be abstract
     * to ensure that all input at least attempts to be unique
     */
    // @ts-ignore
    ctx.cache[camelCase(options?.key || Cache.name)] = new Cache({
      client: ctx.client.redis.client(),
      expiresInSeconds: options?.expiresInSeconds,
      logger: ctx.logger,
    });

    metric.end();

    await next();
  };

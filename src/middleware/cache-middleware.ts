import { DefaultState, Middleware } from "koa";
import { IKoaRedisContext } from "../types";
import { RedisCache } from "@lindorm-io/redis";
import { camelCase } from "lodash";

interface CacheMiddlewareOptions {
  key?: string;
  expiresInSeconds?: number;
}

export const cacheMiddleware =
  (Cache: typeof RedisCache, options?: CacheMiddlewareOptions): Middleware<DefaultState, IKoaRedisContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    /*
     * Ignoring TS here since Cache needs to be abstract
     * to ensure that all input at least attempts to be unique
     */
    // @ts-ignore
    ctx.cache[camelCase(options?.key || Cache.name)] = new Cache({
      client: await ctx.client.redis.client(),
      expiresInSeconds: options?.expiresInSeconds,
      logger: ctx.logger,
    });

    ctx.metrics.cache = (ctx.metrics.cache || 0) + (Date.now() - start);

    await next();
  };

import { Middleware, Next } from "koa";
import { camelCase } from "lodash";
import { CacheBase } from "@lindorm-io/redis";
import { IKoaRedisContext } from "../types";

interface CacheMiddlewareOptions {
  key?: string;
  expiresInSeconds?: number;
}

export const cacheMiddleware = (Cache: typeof CacheBase, options?: CacheMiddlewareOptions): Middleware => async (
  ctx: IKoaRedisContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  const client = await ctx.client.redis.getClient();
  const logger = ctx.logger;

  /*
   * Ignoring TS here since Cache needs to be abstract
   * to ensure that all input at least attempts to be unique
   */
  // @ts-ignore
  ctx.cache[camelCase(options?.key || Cache.name)] = new Cache({
    client,
    expiresInSeconds: options?.expiresInSeconds,
    logger,
  });

  ctx.metrics.cache = (ctx.metrics.cache || 0) + (Date.now() - start);

  await next();
};

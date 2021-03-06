import { ClientError } from "@lindorm-io/errors";
import { EntityBase } from "@lindorm-io/entity";
import { EntityNotFoundError, CacheBase } from "@lindorm-io/redis";
import { Middleware } from "@lindorm-io/koa";
import { RedisContext } from "../types";
import { camelCase, get, isString } from "lodash";

interface MiddlewareOptions {
  cacheKey?: string;
  entityKey?: string;
}

export interface CacheEntityMiddlewareOptions {
  optional?: boolean;
}

export const cacheEntityMiddleware =
  (Entity: typeof EntityBase, Cache: typeof CacheBase, middlewareOptions: MiddlewareOptions = {}) =>
  (path: string, options: CacheEntityMiddlewareOptions = {}): Middleware<RedisContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("entity");

    const key = get(ctx, path);

    if (!isString(key) && options.optional) {
      ctx.logger.debug("Optional entity identifier not found", { path });

      metric.end();

      return await next();
    }

    if (!isString(key)) {
      throw new ClientError("Invalid key", {
        debug: { path, key },
        description: "Entity key expected",
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }

    const entity = middlewareOptions.entityKey || camelCase(Entity.name);
    const cache = middlewareOptions.cacheKey || camelCase(Cache.name);

    try {
      ctx.entity[entity] = await ctx.cache[cache].find(key);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new ClientError(`Invalid ${Entity.name}`, {
          debug: { key },
          error: err,
          statusCode: ClientError.StatusCode.BAD_REQUEST,
        });
      }

      metric.end();

      throw err;
    }

    metric.end();

    await next();
  };

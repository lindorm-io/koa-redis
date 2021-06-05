import { KoaContext } from "@lindorm-io/koa";
import { RedisCache, RedisConnection } from "@lindorm-io/redis";

export interface RedisContext extends KoaContext {
  cache: Record<string, RedisCache>;
  client: {
    redis: RedisConnection;
  };
}

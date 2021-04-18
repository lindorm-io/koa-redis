import { RedisCache, RedisConnection } from "@lindorm-io/redis";
import { IKoaAppContext } from "@lindorm-io/koa";

export interface IKoaRedisContext extends IKoaAppContext {
  cache: Record<string, RedisCache>;
  client: { redis: RedisConnection };
}

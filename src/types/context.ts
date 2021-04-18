import { CacheBase, RedisConnection } from "@lindorm-io/redis";
import { IKoaAppContext } from "@lindorm-io/koa";

export interface IKoaRedisContext extends IKoaAppContext {
  cache: Record<string, CacheBase<any>>;
  redis: RedisConnection;
}

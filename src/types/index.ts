import { IKoaAppContext } from "@lindorm-io/koa";
import { RedisConnection } from "@lindorm-io/redis";

export type TNext = () => Promise<void>

export interface IRedisMiddlewareContext extends IKoaAppContext {
  redis: RedisConnection;
}

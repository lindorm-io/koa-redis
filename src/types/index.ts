import { IKoaAppContext } from "@lindorm-io/koa";
import { IRedisConnectionOptions, RedisConnection, TRedisClient } from "@lindorm-io/redis";

export interface IRedisMiddlewareOptions extends IRedisConnectionOptions {
  clientRef?: (client: TRedisClient) => void;
}

export interface IRedisMiddlewareContext extends IKoaAppContext {
  redis: RedisConnection;
}

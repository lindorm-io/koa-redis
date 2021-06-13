import { EntityAttributes, LindormEntity } from "@lindorm-io/entity";
import { KoaContext } from "@lindorm-io/koa";
import { LindormCache, RedisConnection } from "@lindorm-io/redis";

export interface RedisContext extends KoaContext {
  cache: Record<string, LindormCache<EntityAttributes, LindormEntity<EntityAttributes>>>;
  client: {
    redis: RedisConnection;
  };
  entity: Record<string, LindormEntity<EntityAttributes>>;
}

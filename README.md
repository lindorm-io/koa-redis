# @lindorm-io/koa-redis
Mongo Connection middleware for @lindorm-io/koa applications

## Installation
```shell script
npm install --save @lindorm-io/koa-redis
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/entity](https://www.npmjs.com/package/@lindorm-io/entity)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/redis](https://www.npmjs.com/package/@lindorm-io/redis)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Client Middleware
```typescript
koaApp.addMiddleware(redisMiddleware({
  type: RedisConnectionType.CACHE,
  port: 6000,
}));

await ctx.client.redis.connect();
```

### Cache Middleware
```typescript
koaApp.addMiddleware(cacheMiddleware(YourCacheClass));

await ctx.cache.yourCacheClass.create(yourEntity);
```

### Entity Middleware
```typescript
koaApp.addMiddleware(cacheEntityMiddleware("body.entityId", YourEntityClass, YourCacheClass));

ctx.entity.yourEntityClass.id // -> <uuid>
```

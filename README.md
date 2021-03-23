# @lindorm-io/koa-redis
Mongo Connection middleware for @lindorm-io/koa applications

## Installation
```shell script
npm install --save @lindorm-io/koa-redis
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/redis](https://www.npmjs.com/package/@lindorm-io/redis)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

```typescript
koaApp.addMiddleware(redisMiddleware({
  type: RedisConnectionType.CACHE,
  port: 6000,
}));
```

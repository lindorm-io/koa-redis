import { ClientError } from "@lindorm-io/errors";
import { EntityNotFoundError } from "@lindorm-io/redis";
import { Metric } from "@lindorm-io/koa";
import { cacheEntityMiddleware } from "./cache-entity-middleware";
import { logger } from "../test";

class TestEntity {}
class TestCache {}

const next = () => Promise.resolve();

describe("cacheMiddleware", () => {
  let middlewareOptions: any;
  let options: any;
  let ctx: any;
  let path: string;

  beforeEach(() => {
    middlewareOptions = {};
    options = {};
    ctx = {
      cache: {
        testCache: {
          find: jest.fn().mockResolvedValue(new TestEntity()),
        },
      },
      entity: {},
      logger,
      metrics: {},
      request: { body: { identifier: "identifier" } },
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);

    path = "request.body.identifier";
  });

  test("should set entity on context", async () => {
    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
    expect(ctx.metrics.entity).toStrictEqual(expect.any(Number));
  });

  test("should find cache on context with options key", async () => {
    middlewareOptions.cacheKey = "cacheKey";

    ctx.cache.cacheKey = { find: async () => new TestEntity() };

    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
  });

  test("should set entity on context with options key", async () => {
    middlewareOptions.entityKey = "entityKey";

    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.entityKey).toStrictEqual(expect.any(TestEntity));
  });

  test("should succeed when identifier is optional", async () => {
    options.optional = true;
    ctx.request.body.identifier = undefined;

    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toBeUndefined();
  });

  test("should throw ClientError when identifier is missing", async () => {
    ctx.request.body.identifier = undefined;

    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).rejects.toThrow(ClientError);
  });

  test("should throw ClientError when entity is missing", async () => {
    ctx.cache.testCache.find.mockRejectedValue(new EntityNotFoundError("message"));

    await expect(
      // @ts-ignore
      cacheEntityMiddleware(TestEntity, TestCache, middlewareOptions)(path, options)(ctx, next),
    ).rejects.toThrow(ClientError);
  });
});

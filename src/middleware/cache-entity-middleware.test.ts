import { logger } from "../test";
import { Metric, Middleware } from "@lindorm-io/koa";
import { cacheEntityMiddleware } from "./cache-entity-middleware";
import { ClientError } from "@lindorm-io/errors";
import { EntityNotFoundError } from "@lindorm-io/redis";

class TestEntity {}
class TestCache {}

const next = () => Promise.resolve();

describe("cacheMiddleware", () => {
  let ctx: any;
  let middleware: Middleware<any>;

  beforeEach(() => {
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

    // @ts-ignore
    middleware = cacheEntityMiddleware("request.body.identifier", TestEntity, TestCache);
  });

  test("should set entity on context", async () => {
    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
    expect(ctx.metrics.entity).toStrictEqual(expect.any(Number));
  });

  test("should find cache on context with options key", async () => {
    // @ts-ignore
    middleware = cacheEntityMiddleware("request.body.identifier", TestEntity, TestCache, {
      cacheKey: "cacheKey",
    });

    ctx.cache.cacheKey = { find: async () => new TestEntity() };

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
  });

  test("should set entity on context with options key", async () => {
    // @ts-ignore
    middleware = cacheEntityMiddleware("request.body.identifier", TestEntity, TestCache, {
      entityKey: "entityKey",
    });

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.entityKey).toStrictEqual(expect.any(TestEntity));
  });

  test("should succeed when identifier is optional", async () => {
    // @ts-ignore
    middleware = cacheEntityMiddleware("request.body.identifier", TestEntity, TestCache, {
      optional: true,
    });

    ctx.request.body.identifier = undefined;

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toBeUndefined();
  });

  test("should throw ClientError when identifier is missing", async () => {
    ctx.request.body.identifier = undefined;

    await expect(middleware(ctx, next)).rejects.toThrow(ClientError);
  });

  test("should throw ClientError when entity is missing", async () => {
    ctx.cache.testCache.find.mockRejectedValue(new EntityNotFoundError("message"));

    await expect(middleware(ctx, next)).rejects.toThrow(ClientError);
  });
});

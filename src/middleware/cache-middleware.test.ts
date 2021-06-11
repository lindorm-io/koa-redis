import { cacheMiddleware } from "./cache-middleware";
import { logger } from "../test";
import { Metric } from "@lindorm-io/koa";

class Test {}

const next = () => Promise.resolve();

describe("cacheMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: { redis: { client: () => "client" } },
      logger,
      metrics: {},
      cache: {},
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  test("should set cache on context", async () => {
    // @ts-ignore
    await expect(cacheMiddleware(Test)(ctx, next)).resolves.toBeUndefined();
    expect(ctx.cache.test).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.redis).toStrictEqual(expect.any(Number));
  });

  test("should set cache with specific key", async () => {
    // @ts-ignore
    await expect(cacheMiddleware(Test, { key: "otherKey" })(ctx, next)).resolves.toBeUndefined();
    expect(ctx.cache.otherKey).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.redis).toStrictEqual(expect.any(Number));
  });
});

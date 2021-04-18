import { cacheMiddleware } from "./cache-middleware";
import { logger } from "../test";

class Test {}

const next = () => Promise.resolve();

describe("cacheMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      logger,
      metrics: {},
      redis: { getClient: () => "client" },
      cache: {},
    };
  });

  test("should set cache on context", async () => {
    // @ts-ignore
    await expect(cacheMiddleware(Test)(ctx, next)).resolves.toBe(undefined);
    expect(ctx.cache).toMatchSnapshot();
    expect(ctx.metrics.cache).toStrictEqual(expect.any(Number));
  });

  test("should set cache with specific key", async () => {
    // @ts-ignore
    await expect(cacheMiddleware(Test, { key: "otherKey" })(ctx, next)).resolves.toBe(undefined);
    expect(ctx.cache).toMatchSnapshot();
    expect(ctx.metrics.cache).toStrictEqual(expect.any(Number));
  });
});

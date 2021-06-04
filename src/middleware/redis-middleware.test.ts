import MockDate from "mockdate";
import { RedisConnectionOptions, RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { redisMiddleware } from "./redis-middleware";
import { logger } from "../test";

jest.mock("uuid", () => ({
  v4: () => "e397bc49-849e-4df6-a536-7b9fa3574ace",
}));

MockDate.set("2020-01-01T08:00:00.000Z");

const next = () => Promise.resolve();

describe("redisMiddleware", () => {
  let ctx: any;
  let inMemoryCache: Record<string, any>;
  let options: RedisConnectionOptions;

  beforeEach(() => {
    inMemoryCache = { initialized: true };

    options = {
      type: RedisConnectionType.MEMORY,
      port: 100,
      inMemoryCache,
    };

    ctx = { client: {}, logger, metrics: {} };
  });

  test("should set a functional redis on context", async () => {
    await expect(redisMiddleware(options)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.client.redis).toStrictEqual(expect.any(RedisConnection));

    const client = ctx.client.redis.client();
    await expect(client.set("key", { blob: "yes" })).resolves.toBe("OK");
    await expect(client.get("key")).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });
});

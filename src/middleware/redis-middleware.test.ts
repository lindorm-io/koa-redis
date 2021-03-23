import MockDate from "mockdate";
import { IRedisConnectionOptions, RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { IRedisMiddlewareContext } from "../types";
import { Logger, LogLevel } from "@lindorm-io/winston";
import { redisMiddleware } from "./redis-middleware";

jest.mock("uuid", () => ({
  v4: () => "e397bc49-849e-4df6-a536-7b9fa3574ace",
}));

MockDate.set("2020-01-01 08:00:00.000");

const logger = new Logger({ packageName: "n", packageVersion: "v" });
logger.addConsole(LogLevel.ERROR);

const next = jest.fn();

describe("redisMiddleware", () => {
  let inMemoryCache: Record<string, any>;
  let options: IRedisConnectionOptions;
  let ctx: IRedisMiddlewareContext;

  beforeEach(() => {
    inMemoryCache = { initialized: true };

    options = {
      type: RedisConnectionType.MEMORY,
      port: 100,
      inMemoryCache,
    };

    // @ts-ignore
    ctx = { logger };
  });

  test("should set a functional redis on context", async () => {
    await expect(redisMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.redis).toStrictEqual(expect.any(RedisConnection));

    const client = ctx.redis.getClient();
    await expect(client.set("key", { blob: "yes" })).resolves.toBe("OK");
    await expect(client.get("key")).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });
});

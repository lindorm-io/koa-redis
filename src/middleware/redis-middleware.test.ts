import MockDate from "mockdate";
import { redisMiddleware } from "./redis-middleware";
import { RedisConnection, RedisConnectionType, RedisInMemoryClient, TRedisClient } from "@lindorm-io/redis";
import { Logger, LogLevel } from "@lindorm-io/winston";
import { IRedisMiddlewareOptions } from "../types";

jest.mock("uuid", () => ({
  v4: () => "e397bc49-849e-4df6-a536-7b9fa3574ace",
}));

MockDate.set("2020-01-01 08:00:00.000");

const logger = new Logger({ packageName: "n", packageVersion: "v" });
logger.addConsole(LogLevel.ERROR);

describe("redisMiddleware", () => {
  let client: TRedisClient;
  let options: IRedisMiddlewareOptions;
  let ctx: any;
  let next: any;

  beforeEach(() => {
    options = {
      type: RedisConnectionType.MEMORY,
      port: 100,
      clientRef: (c) => {
        client = c;
      },
    };
    ctx = { logger };
    next = () => Promise.resolve();
  });

  test("should set a functional redis on context", async () => {
    await expect(redisMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.redis).toStrictEqual(expect.any(RedisConnection));
    expect(client).toStrictEqual(expect.any(RedisInMemoryClient));

    await expect(client.set("key", { blob: "yes" })).resolves.toBe("OK");
    await expect(client.get("key")).resolves.toMatchSnapshot();
  });
});

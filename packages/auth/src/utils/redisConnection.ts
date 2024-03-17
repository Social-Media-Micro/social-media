import logger from "@monorepo/common/src/utils/logger";
import { createClient, type RedisClientType } from "redis";

class RedisConnect {
  private readonly _client: RedisClientType;
  constructor() {
    this._client = createClient({
      url: "redis://192.168.29.64:6379",
    });

    this._client.on("error", (err) => {
      logger.error("Redis Client Error", err);
    });
  }

  get client() {
    if (!this._client) {
      throw new Error("Cannot get redis client before initilazation");
    }
    return this._client;
  }

  public async connect() {
    try {
      await this._client.connect();
      logger.info("Redis connected successfully");
    } catch (error) {
      logger.error("Redis connection failed", error);
    }
  }
}

const redisConnect = new RedisConnect();
export default redisConnect;

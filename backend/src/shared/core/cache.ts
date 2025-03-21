import Redis from "ioredis";
import logger from "./logger";

const redis = new Redis({
  host: process.env.REDIS_HOST,
});
redis.on("error", (err) => {
  logger.error(err);
});
redis.on("ready", () => {
  logger.info("Redis client ready");
});
export default redis;

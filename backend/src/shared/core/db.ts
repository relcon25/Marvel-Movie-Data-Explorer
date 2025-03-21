import { Pool } from "pg";
import logger from "./logger";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 3000; // 3 seconds

const pgConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
};

const client = new Pool(pgConfig);

export async function connectDB(retries = MAX_RETRIES): Promise<void> {
  try {
    await client.query("SELECT 1");
    logger.info("Connected to PostgreSQL");
  } catch (err) {
    logger.error(`PostgreSQL connection error: ${(err as Error).message}`);
    if (retries > 0) {
      logger.info(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectDB(retries - 1), RETRY_INTERVAL);
    } else {
      logger.error("Max retries reached. Could not connect to PostgreSQL.");
      process.exit(1);
    }
  }
}

export default client;

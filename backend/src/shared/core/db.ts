/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool, QueryConfig, QueryResult, QueryResultRow } from "pg";
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

/**
 * Logs and executes a DB query
 */
async function queryWithLog<R extends QueryResultRow = any>(
  queryTextOrConfig: string | QueryConfig<any[]>,
  values?: any[],
): Promise<QueryResult<R>> {
  const sql =
    typeof queryTextOrConfig === "string"
      ? queryTextOrConfig
      : queryTextOrConfig.text;

  logger.info(`🛠 Executing SQL: ${sql}`);
  const start = Date.now();
  const result = await client.query<R>(queryTextOrConfig as any, values);
  const duration = Date.now() - start;
  logger.info(`✅ Query executed in ${duration}ms`);
  return result;
}

// Extend the client with the custom method
interface DBClient extends Pool {
  queryWithLog: typeof queryWithLog;
}

const db = client as DBClient;
db.queryWithLog = queryWithLog;

/**
 * Connection check with retries
 */
export async function connectDB(retries = MAX_RETRIES): Promise<void> {
  try {
    await db.query("SELECT 1");
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

export default db;

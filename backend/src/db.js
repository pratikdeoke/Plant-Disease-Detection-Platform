import pkg from "pg";
import { config } from "./config.js";

const { Pool } = pkg;

const isLocalHost = (host) => host === "localhost" || host === "127.0.0.1";

const trimValue = (value) => (typeof value === "string" ? value.trim() : "");

const readDatabaseConfig = () => {
  const connectionString = trimValue(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_PRISMA_URL
  );

  if (connectionString) {
    return {
      connectionString,
      ssl:
        connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    };
  }

  const host = trimValue(
    process.env.DB_HOST ||
      process.env.PGHOST ||
      process.env.POSTGRES_HOST ||
      process.env.DATABASE_HOST
  );
  const user = trimValue(
    process.env.DB_USER ||
      process.env.PGUSER ||
      process.env.POSTGRES_USER ||
      process.env.DATABASE_USER
  );
  const password = trimValue(
    process.env.DB_PASSWORD ||
      process.env.PGPASSWORD ||
      process.env.POSTGRES_PASSWORD ||
      process.env.DATABASE_PASSWORD
  );
  const database = trimValue(
    process.env.DB_NAME ||
      process.env.PGDATABASE ||
      process.env.POSTGRES_DB ||
      process.env.DATABASE_NAME
  );
  const port = Number(
    process.env.DB_PORT ||
      process.env.PGPORT ||
      process.env.POSTGRES_PORT ||
      process.env.DATABASE_PORT ||
      5432
  );

  if (!host || !user || !password || !database) {
    throw new Error(
      "Database configuration is missing. Set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME."
    );
  }

  const useSsl = !isLocalHost(host) && process.env.DB_SSL !== "false";

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
};
console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const pool = new Pool({
  ...readDatabaseConfig(),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: config.PORT !== undefined,
});
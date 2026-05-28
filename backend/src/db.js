import dns from "dns/promises";
import pkg from "pg";
import { config } from "./config.js";

const { Pool } = pkg;

const isLocalHost = (host) => host === "localhost" || host === "127.0.0.1";

const isIpLiteral = (value) => {
  if (!value) {
    return false;
  }

  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^[0-9a-fA-F:]+$/;

  return ipv4Pattern.test(value) || ipv6Pattern.test(value);
};

const trimValue = (value) => (typeof value === "string" ? value.trim() : "");

const resolveHost = async (host) => {
  if (!host || isLocalHost(host) || isIpLiteral(host)) {
    return host;
  }

  try {
    const ipv6Addresses = await dns.resolve6(host);

    if (ipv6Addresses.length > 0) {
      return ipv6Addresses[0];
    }
  } catch {
    // Fall back to IPv4 if the host does not publish AAAA records.
  }

  try {
    const ipv4Addresses = await dns.resolve4(host);

    if (ipv4Addresses.length > 0) {
      return ipv4Addresses[0];
    }
  } catch {
    // Let the caller surface a clearer error below.
  }

  return host;
};

const readDatabaseConfig = async () => {
  const connectionString = trimValue(
    process.env.DATABASE_URL ||
      process.env.SUPABASE_POOLER_URL ||
      process.env.POSTGRES_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_PRISMA_URL
  );

  if (connectionString) {
    const parsedUrl = new URL(connectionString);
    const resolvedHost = await resolveHost(parsedUrl.hostname);

    return {
      host: resolvedHost,
      port: Number(parsedUrl.port || 5432),
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: decodeURIComponent(parsedUrl.pathname.replace(/^\//, "")),
      ssl: isLocalHost(parsedUrl.hostname) ? false : { rejectUnauthorized: false },
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

  const resolvedHost = await resolveHost(host);
  const useSsl = !isLocalHost(host) && process.env.DB_SSL !== "false";

  return {
    host: resolvedHost,
    port,
    user,
    password,
    database,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
};

const databaseConfig = await readDatabaseConfig();

export const pool = new Pool({
  ...databaseConfig,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: config.PORT !== undefined,
});
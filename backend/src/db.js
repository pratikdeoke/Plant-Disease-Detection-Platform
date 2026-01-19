import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

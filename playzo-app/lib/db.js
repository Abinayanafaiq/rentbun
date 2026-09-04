import pg from "pg";

const { Pool } = pg;

// Reuse pool saat hot-reload di development
const pool = global.pgPool || new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") global.pgPool = pool;

export function q(text, params) {
  return pool.query(text, params);
}

import { Pool } from "pg"

const globalForPg = globalThis as unknown as { _pgPool?: Pool }

export const pool =
  globalForPg._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
  })

if (process.env.NODE_ENV !== "production") globalForPg._pgPool = pool

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS zt_zipcodes (
      id          SERIAL PRIMARY KEY,
      city        TEXT NOT NULL,
      zipcode     TEXT NOT NULL UNIQUE,
      total_pages INT  NOT NULL DEFAULT 0,
      territory   TEXT NOT NULL DEFAULT 'Lacy Boulevard',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Migrate: add territory column if it doesn't exist yet
  await pool.query(`
    ALTER TABLE zt_zipcodes ADD COLUMN IF NOT EXISTS territory TEXT NOT NULL DEFAULT 'Lacy Boulevard'
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS zt_users (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS zt_segments (
      id               SERIAL PRIMARY KEY,
      zipcode_id       INT  NOT NULL REFERENCES zt_zipcodes(id) ON DELETE CASCADE,
      page_start       INT  NOT NULL,
      page_end         INT,
      owner            TEXT NOT NULL DEFAULT '',
      stopped_at_page  INT,
      status           TEXT NOT NULL DEFAULT 'Not started',
      notes            TEXT NOT NULL DEFAULT '',
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

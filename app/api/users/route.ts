import { NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

// GET /api/users — returns all distinct owners from segments, sorted alphabetically
export async function GET() {
  await ensureSchema()
  const result = await pool.query(`
    SELECT DISTINCT TRIM(owner) AS name
    FROM zt_segments
    WHERE owner IS NOT NULL AND TRIM(owner) <> ''
    ORDER BY name
  `)
  return NextResponse.json(result.rows.map((r: { name: string }) => r.name))
}

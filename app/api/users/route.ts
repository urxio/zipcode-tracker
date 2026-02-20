import { NextRequest, NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

// GET /api/users — returns all users from zt_users + any segment owners not yet there
export async function GET() {
  await ensureSchema()
  const result = await pool.query(`
    SELECT name FROM (
      SELECT name FROM zt_users
      UNION
      SELECT DISTINCT TRIM(owner) AS name
      FROM zt_segments
      WHERE owner IS NOT NULL AND TRIM(owner) <> ''
    ) combined
    ORDER BY name
  `)
  return NextResponse.json(result.rows.map((r: { name: string }) => r.name))
}

// POST /api/users — upsert a user by name
export async function POST(req: NextRequest) {
  await ensureSchema()
  const body = await req.json()
  const name = (body.name ?? "").trim()
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

  await pool.query(
    `INSERT INTO zt_users (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [name]
  )
  return NextResponse.json({ success: true })
}

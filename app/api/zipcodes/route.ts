import { NextRequest, NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

// POST /api/zipcodes — add a new zipcode
export async function POST(req: NextRequest) {
  await ensureSchema()
  const body = await req.json()
  const city        = (body.city        ?? "").trim()
  const zipcode     = (body.zipcode     ?? "").trim()
  const total_pages = parseInt(body.total_pages ?? "0")
  const territory   = (body.territory   ?? "Lacy Boulevard").trim()

  if (!city || !zipcode || !total_pages) {
    return NextResponse.json({ error: "city, zipcode, and total_pages are required" }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `INSERT INTO zt_zipcodes (city, zipcode, total_pages, territory)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (zipcode) DO NOTHING
       RETURNING *`,
      [city, zipcode, total_pages, territory]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Zipcode already exists" }, { status: 409 })
    }
    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  await ensureSchema()
  const result = await pool.query(`
    SELECT
      z.id,
      z.city,
      z.zipcode,
      z.total_pages,
      z.territory,
      COUNT(s.id)::int                                                        AS segment_count,
      COALESCE(SUM(CASE WHEN s.status = 'Completed'   THEN 1 ELSE 0 END),0)::int AS completed,
      COALESCE(SUM(CASE WHEN s.status = 'In progress' THEN 1 ELSE 0 END),0)::int AS in_progress,
      COALESCE(SUM(CASE WHEN s.status = 'Not started' THEN 1 ELSE 0 END),0)::int AS not_started
    FROM zt_zipcodes z
    LEFT JOIN zt_segments s ON s.zipcode_id = z.id
    GROUP BY z.id
    ORDER BY z.territory, z.city, z.zipcode
  `)
  return NextResponse.json(result.rows)
}

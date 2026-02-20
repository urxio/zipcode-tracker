import { NextRequest, NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

// GET /api/segments/mine?owner=Boris
// Returns all segments for a given owner, joined with zipcode info
export async function GET(req: NextRequest) {
  await ensureSchema()
  const owner = req.nextUrl.searchParams.get("owner")
  if (!owner) return NextResponse.json({ error: "Missing owner" }, { status: 400 })

  const result = await pool.query(`
    SELECT
      s.id,
      s.page_start,
      s.page_end,
      s.owner,
      s.stopped_at_page,
      s.status,
      s.notes,
      s.updated_at,
      z.city,
      z.zipcode,
      z.total_pages
    FROM zt_segments s
    JOIN zt_zipcodes z ON z.id = s.zipcode_id
    WHERE LOWER(TRIM(s.owner)) = LOWER(TRIM($1))
    ORDER BY
      CASE s.status
        WHEN 'In progress' THEN 0
        WHEN 'Not started' THEN 1
        WHEN 'Completed'   THEN 2
      END,
      z.city, z.zipcode, s.page_start
  `, [owner])

  return NextResponse.json(result.rows)
}

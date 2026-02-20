import { NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

export async function GET() {
  await ensureSchema()
  const result = await pool.query(`
    SELECT
      z.id,
      z.city,
      z.zipcode,
      z.total_pages,
      COUNT(s.id)::int                                                        AS segment_count,
      COALESCE(SUM(CASE WHEN s.status = 'Completed'   THEN 1 ELSE 0 END),0)::int AS completed,
      COALESCE(SUM(CASE WHEN s.status = 'In progress' THEN 1 ELSE 0 END),0)::int AS in_progress,
      COALESCE(SUM(CASE WHEN s.status = 'Not started' THEN 1 ELSE 0 END),0)::int AS not_started
    FROM zt_zipcodes z
    LEFT JOIN zt_segments s ON s.zipcode_id = z.id
    GROUP BY z.id
    ORDER BY z.city, z.zipcode
  `)
  return NextResponse.json(result.rows)
}

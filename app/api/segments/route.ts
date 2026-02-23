import { NextRequest, NextResponse } from "next/server"
import { pool, ensureSchema } from "@/lib/db"

// GET /api/segments?zipcode=22030
export async function GET(req: NextRequest) {
  await ensureSchema()
  const zipcode = req.nextUrl.searchParams.get("zipcode")
  if (!zipcode) return NextResponse.json({ error: "Missing zipcode" }, { status: 400 })

  const result = await pool.query(`
    SELECT s.*, z.city, z.zipcode, z.total_pages
    FROM zt_segments s
    JOIN zt_zipcodes z ON z.id = s.zipcode_id
    WHERE z.zipcode = $1
    ORDER BY s.page_start
  `, [zipcode])

  if (result.rows.length === 0) {
    // Maybe zipcode exists but has no segments — check zipcode
    const z = await pool.query(`SELECT * FROM zt_zipcodes WHERE zipcode = $1`, [zipcode])
    if (z.rows.length === 0) return NextResponse.json({ error: "Zipcode not found" }, { status: 404 })
    return NextResponse.json({ zipcode: z.rows[0], segments: [] })
  }

  const { city, zipcode: zc, total_pages } = result.rows[0]
  return NextResponse.json({
    zipcode: { city, zipcode: zc, total_pages },
    segments: result.rows.map(r => ({
      id: r.id,
      page_start: r.page_start,
      page_end: r.page_end,
      owner: r.owner,
      stopped_at_page: r.stopped_at_page,
      status: r.status,
      notes: r.notes,
      updated_at: r.updated_at,
    })),
  })
}

// POST /api/segments — claim a new segment
export async function POST(req: NextRequest) {
  await ensureSchema()
  const body = await req.json()
  const { zipcode, page_start, page_end, owner } = body

  if (!zipcode || !page_start || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const z = await pool.query(`SELECT id FROM zt_zipcodes WHERE zipcode = $1`, [zipcode])
  if (z.rows.length === 0) return NextResponse.json({ error: "Zipcode not found" }, { status: 404 })

  const result = await pool.query(
    `INSERT INTO zt_segments (zipcode_id, page_start, page_end, owner, status)
     VALUES ($1, $2, $3, $4, 'Not started')
     RETURNING *`,
    [z.rows[0].id, page_start, page_end ?? null, owner]
  )
  return NextResponse.json(result.rows[0])
}

// PATCH /api/segments — update a segment
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, stopped_at_page, status, owner, notes, page_start, page_end, update_range } = body

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  let result
  if (update_range && page_start != null) {
    result = await pool.query(
      `UPDATE zt_segments
       SET
         page_start      = $2,
         page_end        = $3,
         stopped_at_page = COALESCE($4, stopped_at_page),
         status          = COALESCE($5, status),
         updated_at      = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, page_start, page_end ?? null, stopped_at_page ?? null, status ?? null]
    )
  } else {
    result = await pool.query(
      `UPDATE zt_segments
       SET
         stopped_at_page = COALESCE($2, stopped_at_page),
         status          = COALESCE($3, status),
         owner           = COALESCE($4, owner),
         notes           = COALESCE($5, notes),
         updated_at      = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, stopped_at_page ?? null, status ?? null, owner ?? null, notes ?? null]
    )
  }

  if (result.rows.length === 0) return NextResponse.json({ error: "Segment not found" }, { status: 404 })
  return NextResponse.json(result.rows[0])
}

// DELETE /api/segments?id=X — delete a segment
export async function DELETE(req: NextRequest) {
  await ensureSchema()
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const result = await pool.query(`DELETE FROM zt_segments WHERE id = $1 RETURNING id`, [parseInt(id)])
  if (result.rows.length === 0) return NextResponse.json({ error: "Segment not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}

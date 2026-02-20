import { pool, ensureSchema } from "../lib/db"

const DATA: {
  city: string
  zipcode: string
  totalPages: number
  territory: string
  segments: {
    page_start: number
    page_end: number | null
    owner: string
    stopped_at_page: number | null
    status: string
    notes: string
  }[]
}[] = [
  {
    city: "Woodbridge", zipcode: "22191", totalPages: 1656, territory: "Woodbridge",
    segments: [
      { page_start: 1,    page_end: 20,   owner: "Pamela", stopped_at_page: 20,   status: "Completed", notes: "" },
      { page_start: 21,   page_end: 200,  owner: "Mick",   stopped_at_page: 200,  status: "Completed", notes: "" },
      { page_start: 201,  page_end: 250,  owner: "Pamela", stopped_at_page: 250,  status: "Completed", notes: "" },
      { page_start: 251,  page_end: 350,  owner: "Pamela", stopped_at_page: 350,  status: "Completed", notes: "" },
      { page_start: 351,  page_end: 500,  owner: "Pamela", stopped_at_page: 500,  status: "Completed", notes: "" },
      { page_start: 501,  page_end: 600,  owner: "Pamela", stopped_at_page: 600,  status: "Completed", notes: "" },
      { page_start: 601,  page_end: 700,  owner: "Pamela", stopped_at_page: null, status: "Completed", notes: "" },
      { page_start: 701,  page_end: 800,  owner: "Mick",   stopped_at_page: 800,  status: "Completed", notes: "" },
      { page_start: 801,  page_end: 900,  owner: "Pamela", stopped_at_page: 900,  status: "Completed", notes: "" },
      { page_start: 901,  page_end: 1000, owner: "Mick",   stopped_at_page: 1000, status: "Completed", notes: "" },
      { page_start: 1001, page_end: 1400, owner: "Mick",   stopped_at_page: 1400, status: "Completed", notes: "" },
      { page_start: 1401, page_end: 1656, owner: "Mick",   stopped_at_page: 1656, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Woodbridge", zipcode: "22192", totalPages: 1549, territory: "Woodbridge",
    segments: [
      { page_start: 1,    page_end: 200,  owner: "Mick", stopped_at_page: 200,  status: "Completed", notes: "" },
      { page_start: 201,  page_end: 400,  owner: "Mick", stopped_at_page: 400,  status: "Completed", notes: "" },
      { page_start: 401,  page_end: 600,  owner: "Mick", stopped_at_page: 600,  status: "Completed", notes: "" },
      { page_start: 601,  page_end: 800,  owner: "Mick", stopped_at_page: 800,  status: "Completed", notes: "" },
      { page_start: 801,  page_end: 1000, owner: "Mick", stopped_at_page: 1000, status: "Completed", notes: "" },
      { page_start: 1001, page_end: 1200, owner: "Mick", stopped_at_page: 1200, status: "Completed", notes: "" },
      { page_start: 1201, page_end: 1549, owner: "Mick", stopped_at_page: 1549, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Woodbridge", zipcode: "22193", totalPages: 1974, territory: "Woodbridge",
    segments: [
      { page_start: 1,   page_end: 150, owner: "Jadon",   stopped_at_page: 150, status: "Completed",   notes: "" },
      { page_start: 151, page_end: 301, owner: "Jadon",   stopped_at_page: 300, status: "Completed",   notes: "" },
      { page_start: 302, page_end: 350, owner: "Sabrina", stopped_at_page: 350, status: "Completed",   notes: "" },
      { page_start: 351, page_end: 400, owner: "Jadon",   stopped_at_page: 400, status: "Completed",   notes: "" },
      { page_start: 401, page_end: 500, owner: "Jadon",   stopped_at_page: 415, status: "In progress", notes: "" },
      { page_start: 501, page_end: 502, owner: "Rikkiah", stopped_at_page: null, status: "Completed",  notes: "" },
    ],
  },
  {
    city: "Dumfries", zipcode: "22025", totalPages: 515, territory: "Woodbridge",
    segments: [
      { page_start: 1,   page_end: 200, owner: "Mick", stopped_at_page: 200, status: "Completed", notes: "" },
      { page_start: 201, page_end: 400, owner: "Mick", stopped_at_page: 400, status: "Completed", notes: "" },
      { page_start: 401, page_end: 515, owner: "Mick", stopped_at_page: 515, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Dumfries", zipcode: "22026", totalPages: 546, territory: "Woodbridge",
    segments: [
      { page_start: 1,   page_end: 200, owner: "Pamela", stopped_at_page: 200, status: "Completed",   notes: "" },
      { page_start: 201, page_end: 300, owner: "Pamela", stopped_at_page: 225, status: "In progress", notes: "" },
      { page_start: 400, page_end: 576, owner: "Martus", stopped_at_page: 576, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Springfield", zipcode: "22150", totalPages: 693, territory: "Woodbridge",
    segments: [
      { page_start: 1, page_end: 200, owner: "Mick", stopped_at_page: 100, status: "In progress", notes: "" },
    ],
  },
  {
    city: "Springfield", zipcode: "22151", totalPages: 478, territory: "Woodbridge",
    segments: [
      { page_start: 1,   page_end: 200, owner: "Mick", stopped_at_page: 200, status: "Completed", notes: "" },
      { page_start: 201, page_end: 300, owner: "Mick", stopped_at_page: 300, status: "Completed", notes: "" },
      { page_start: 301, page_end: 475, owner: "Mick", stopped_at_page: 475, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Springfield", zipcode: "22152", totalPages: 839, territory: "Woodbridge",
    segments: [
      { page_start: 1, page_end: 400, owner: "Martus", stopped_at_page: 393, status: "In progress", notes: "" },
    ],
  },
  {
    city: "Springfield", zipcode: "22153", totalPages: 887, territory: "Woodbridge",
    segments: [
      { page_start: 1, page_end: 50, owner: "Jadon", stopped_at_page: 10, status: "In progress", notes: "" },
    ],
  },
]

async function seed() {
  await ensureSchema()
  console.log("Seeding Woodbridge territory zipcodes and segments...")

  for (const z of DATA) {
    // Upsert zipcode (update territory too)
    const zRes = await pool.query(
      `INSERT INTO zt_zipcodes (city, zipcode, total_pages, territory)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (zipcode) DO UPDATE
         SET city = EXCLUDED.city, total_pages = EXCLUDED.total_pages, territory = EXCLUDED.territory
       RETURNING id`,
      [z.city, z.zipcode, z.totalPages, z.territory]
    )
    const zipcodeId = zRes.rows[0].id

    // Only insert segments if not already seeded
    const existing = await pool.query(
      `SELECT COUNT(*) FROM zt_segments WHERE zipcode_id = $1`,
      [zipcodeId]
    )
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`  ${z.city} ${z.zipcode} — already seeded, skipping segments`)
      continue
    }

    for (const s of z.segments) {
      await pool.query(
        `INSERT INTO zt_segments (zipcode_id, page_start, page_end, owner, stopped_at_page, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [zipcodeId, s.page_start, s.page_end ?? null, s.owner, s.stopped_at_page ?? null, s.status, s.notes]
      )
    }
    console.log(`  ${z.city} ${z.zipcode} — ${z.segments.length} segments inserted`)
  }

  console.log("Done!")
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })

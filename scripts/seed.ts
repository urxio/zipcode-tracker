import { pool, ensureSchema } from "../lib/db"

const DATA: {
  city: string
  zipcode: string
  totalPages: number
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
    city: "Fairfax", zipcode: "22030", totalPages: 1518,
    segments: [
      { page_start: 1,    page_end: 200,  owner: "Boris",    stopped_at_page: 200,  status: "Completed",   notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 201,  page_end: 400,  owner: "Samantha", stopped_at_page: 400,  status: "Completed",   notes: "" },
      { page_start: 401,  page_end: 600,  owner: "Kimberly", stopped_at_page: 600,  status: "Completed",   notes: "Card Number: 23159002853825" },
      { page_start: 601,  page_end: 800,  owner: "Kimberly", stopped_at_page: 800,  status: "Completed",   notes: "" },
      { page_start: 801,  page_end: 1000, owner: "Stephanie",stopped_at_page: 1000, status: "Completed",   notes: "" },
      { page_start: 1001, page_end: 1127, owner: "Tabatha",  stopped_at_page: 1064, status: "Completed",   notes: "" },
      { page_start: 1051, page_end: 1200, owner: "Kimberly", stopped_at_page: 1200, status: "Completed",   notes: "" },
      { page_start: 1201, page_end: 1400, owner: "Le'Kedra", stopped_at_page: 1390, status: "Completed",   notes: "" },
      { page_start: 1401, page_end: 1518, owner: "Faye",     stopped_at_page: 1518, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Fairfax", zipcode: "22031", totalPages: 943,
    segments: [
      { page_start: 1,   page_end: 400, owner: "Mick",     stopped_at_page: 400, status: "Completed",   notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 401, page_end: 600, owner: "Samantha", stopped_at_page: 501, status: "In progress", notes: "" },
      { page_start: 601, page_end: 800, owner: "Kimberly", stopped_at_page: 800, status: "Completed",   notes: "Card Number: 23159002853825" },
      { page_start: 801, page_end: 943, owner: "Mick",     stopped_at_page: 943, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Fairfax", zipcode: "22032", totalPages: 871,
    segments: [
      { page_start: 1,   page_end: 200, owner: "Boris",    stopped_at_page: 200, status: "Completed", notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 201, page_end: 600, owner: "Kimberly", stopped_at_page: 600, status: "Completed", notes: "" },
      { page_start: 601, page_end: 871, owner: "Faye",     stopped_at_page: 871, status: "Completed", notes: "Card Number: 23159002853825" },
    ],
  },
  {
    city: "Fairfax", zipcode: "22033", totalPages: 1119,
    segments: [
      { page_start: 1,    page_end: 400,  owner: "Stephanie", stopped_at_page: 352,  status: "In progress", notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 401,  page_end: 800,  owner: "Kimberly",  stopped_at_page: 800,  status: "Completed",   notes: "" },
      { page_start: 800,  page_end: 1000, owner: "Boris",     stopped_at_page: 1000, status: "Completed",   notes: "Card Number: 23159002853825" },
      { page_start: 1001, page_end: 1119, owner: "Kimberly",  stopped_at_page: 1119, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Annandale", zipcode: "22003", totalPages: 1461,
    segments: [
      { page_start: 1,    page_end: 200,  owner: "Boris",     stopped_at_page: 200,  status: "Completed",   notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 201,  page_end: 600,  owner: "Kimberly",  stopped_at_page: 600,  status: "Completed",   notes: "" },
      { page_start: 601,  page_end: 620,  owner: "Boris",     stopped_at_page: 620,  status: "Completed",   notes: "Card Number: 23159002853825" },
      { page_start: 621,  page_end: 720,  owner: "Samantha",  stopped_at_page: 720,  status: "Completed",   notes: "" },
      { page_start: 721,  page_end: 900,  owner: "Stephanie", stopped_at_page: 900,  status: "Completed",   notes: "" },
      { page_start: 901,  page_end: 1000, owner: "Samantha",  stopped_at_page: 910,  status: "In progress", notes: "" },
      { page_start: 1001, page_end: 1251, owner: "Faye",      stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 1252, page_end: 1461, owner: "Kimberly",  stopped_at_page: 1461, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "McLean", zipcode: "22101", totalPages: 965,
    segments: [
      { page_start: 1,   page_end: 100, owner: "Boris",    stopped_at_page: 90,  status: "Completed", notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 101, page_end: 400, owner: "Kimberly", stopped_at_page: 400, status: "Completed", notes: "" },
      { page_start: 401, page_end: 965, owner: "Kimberly", stopped_at_page: 965, status: "Completed", notes: "Card Number: 23159002853825" },
    ],
  },
  {
    city: "McLean", zipcode: "22102", totalPages: 890,
    segments: [
      { page_start: 1,   page_end: 250, owner: "Blessing",  stopped_at_page: null, status: "Not started", notes: "" },
      { page_start: 251, page_end: 400, owner: "Sabrina",   stopped_at_page: null, status: "Not started", notes: "" },
      { page_start: 401, page_end: 450, owner: "Rikkiah",   stopped_at_page: 406,  status: "In progress", notes: "" },
      { page_start: 451, page_end: 460, owner: "Le'Kedra",  stopped_at_page: 460,  status: "Completed",   notes: "" },
      { page_start: 461, page_end: 570, owner: "Boris",     stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 570, page_end: 711, owner: "Boris",     stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 712, page_end: 712, owner: "Le'Kedra",  stopped_at_page: 712,  status: "Completed",   notes: "" },
      { page_start: 713, page_end: 851, owner: "Arafat",    stopped_at_page: 732,  status: "In progress", notes: "Card Number: 23159002853825" },
      { page_start: 733, page_end: 890, owner: "Le'Kedra",  stopped_at_page: 760,  status: "In progress", notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22201", totalPages: 1081,
    segments: [
      { page_start: 1,   page_end: 50,   owner: "Boris",     stopped_at_page: 50,   status: "Completed",   notes: "A-Z Link: https://www.pwcva.gov/department/library/digital-library" },
      { page_start: 50,  page_end: 100,  owner: "Boris",     stopped_at_page: 100,  status: "Completed",   notes: "" },
      { page_start: 101, page_end: 150,  owner: "Le'Kedra",  stopped_at_page: 111,  status: "In progress", notes: "Card Number: 23159002853825" },
      { page_start: 151, page_end: 200,  owner: "Stephanie", stopped_at_page: 171,  status: "In progress", notes: "" },
      { page_start: 201, page_end: 400,  owner: "Kimberly",  stopped_at_page: 400,  status: "Completed",   notes: "" },
      { page_start: 401, page_end: 500,  owner: "Kimberly",  stopped_at_page: 500,  status: "Completed",   notes: "" },
      { page_start: 501, page_end: 1081, owner: "Kimberly",  stopped_at_page: 1081, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22202", totalPages: 749,
    segments: [
      { page_start: 1, page_end: 749, owner: "Kimberly", stopped_at_page: 749, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22203", totalPages: 711,
    segments: [
      { page_start: 1,   page_end: 100, owner: "Blessing",  stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 101, page_end: 300, owner: "Blessing",  stopped_at_page: 160,  status: "In progress", notes: "" },
      { page_start: 301, page_end: 500, owner: "Boris",     stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 501, page_end: 541, owner: "Kimberly",  stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 542, page_end: 550, owner: "Jason",     stopped_at_page: 550,  status: "Completed",   notes: "" },
      { page_start: 551, page_end: 560, owner: "Mireille",  stopped_at_page: null, status: "In progress", notes: "" },
      { page_start: 561, page_end: 600, owner: "Patricia",  stopped_at_page: 564,  status: "In progress", notes: "" },
      { page_start: 601, page_end: 640, owner: "Kimberly",  stopped_at_page: 640,  status: "Completed",   notes: "" },
      { page_start: 641, page_end: 685, owner: "Le'Kedra",  stopped_at_page: null, status: "Completed",   notes: "" },
      { page_start: 686, page_end: 711, owner: "Kimberly",  stopped_at_page: null, status: "Completed",   notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22204", totalPages: 1246,
    segments: [
      { page_start: 1,   page_end: 100, owner: "Boris", stopped_at_page: 82,   status: "Completed", notes: "" },
      { page_start: 101, page_end: 112, owner: "Boris", stopped_at_page: null, status: "Completed", notes: "" },
      { page_start: 113, page_end: 116, owner: "Boris", stopped_at_page: null, status: "Completed", notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22205", totalPages: 501,
    segments: [
      { page_start: 1,  page_end: 25,  owner: "Le'Kedra",  stopped_at_page: null, status: "Not started", notes: "" },
      { page_start: 26, page_end: null, owner: "Stephanie", stopped_at_page: null, status: "In progress", notes: "" },
    ],
  },
  {
    city: "Arlington", zipcode: "22207", totalPages: 968,
    segments: [
      { page_start: 1,   page_end: 100, owner: "Faye",     stopped_at_page: 100,  status: "Completed",   notes: "" },
      { page_start: 101, page_end: 200, owner: "Faye",     stopped_at_page: 150,  status: "In progress", notes: "" },
      { page_start: 201, page_end: 281, owner: "Kimberly", stopped_at_page: null, status: "In progress", notes: "" },
    ],
  },
  { city: "Arlington",    zipcode: "22209", totalPages: 450,  segments: [] },
  { city: "Arlington",    zipcode: "22213", totalPages: 102,  segments: [] },
  { city: "Alexandria",   zipcode: "22304", totalPages: 1311, segments: [] },
  { city: "Alexandria",   zipcode: "22305", totalPages: 376,  segments: [] },
  { city: "Burke",        zipcode: "22015", totalPages: 1246, segments: [] },
  {
    city: "Falls Church", zipcode: "22042", totalPages: 841,
    segments: [
      { page_start: 1,   page_end: 100, owner: "Lynda",    stopped_at_page: 40,  status: "Not started", notes: "" },
      { page_start: 101, page_end: 108, owner: "Samantha", stopped_at_page: 108, status: "Completed",   notes: "" },
      { page_start: 109, page_end: 126, owner: "Samantha", stopped_at_page: null,status: "Not started", notes: "" },
    ],
  },
  {
    city: "Falls Church", zipcode: "22043", totalPages: 660,
    segments: [
      { page_start: 1,   page_end: 141, owner: "Estee",    stopped_at_page: 141, status: "Completed", notes: "" },
      { page_start: 142, page_end: 660, owner: "Kimberly", stopped_at_page: 660, status: "Completed", notes: "" },
    ],
  },
  { city: "Falls Church", zipcode: "22044", totalPages: 326, segments: [] },
  { city: "Falls Church", zipcode: "22046", totalPages: 525, segments: [] },
]

async function seed() {
  await ensureSchema()

  console.log("Seeding zipcodes and segments...")

  for (const z of DATA) {
    // Upsert zipcode
    const zRes = await pool.query(
      `INSERT INTO zt_zipcodes (city, zipcode, total_pages)
       VALUES ($1, $2, $3)
       ON CONFLICT (zipcode) DO UPDATE
         SET city = EXCLUDED.city, total_pages = EXCLUDED.total_pages
       RETURNING id`,
      [z.city, z.zipcode, z.totalPages]
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

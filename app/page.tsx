"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"

type ZipcodeRow = {
  id: number
  city: string
  zipcode: string
  total_pages: number
  segment_count: number
  completed: number
  in_progress: number
  not_started: number
}

const STATUS_COLOR: Record<string, string> = {
  Completed:    "bg-green-500",
  "In progress": "bg-amber-400",
  "Not started": "bg-gray-200 dark:bg-gray-700",
}

function pct(a: number, total: number) {
  return total > 0 ? Math.round((a / total) * 100) : 0
}

export default function Home() {
  const [zipcodes, setZipcodes] = useState<ZipcodeRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [userName, setUserName] = useState("")
  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("zt_user")
    if (saved) setUserName(saved)

    fetch("/api/zipcodes")
      .then(r => r.json())
      .then(data => { setZipcodes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const saveName = () => {
    const n = nameInput.trim()
    if (!n) return
    localStorage.setItem("zt_user", n)
    setUserName(n)
  }

  // Group by city
  const grouped = useMemo(() => {
    const map: Record<string, ZipcodeRow[]> = {}
    for (const z of zipcodes) {
      if (!map[z.city]) map[z.city] = []
      map[z.city].push(z)
    }
    return map
  }, [zipcodes])

  const totalSegments  = zipcodes.reduce((a, z) => a + z.segment_count, 0)
  const totalCompleted = zipcodes.reduce((a, z) => a + z.completed, 0)
  const overallPct     = pct(totalCompleted, totalSegments)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">📍</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">Zipcode Tracker</span>
          </div>
          {userName ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Signed in as</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                {userName}
              </span>
              <button
                onClick={() => { localStorage.removeItem("zt_user"); setUserName(""); setNameInput("") }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveName()}
                placeholder="Your name…"
                className="h-8 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-36"
              />
              <button
                onClick={saveName}
                className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
              >
                Set name
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Lacy Boulevard Territory Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track page-range assignments across all zipcodes. Click a zipcode to view or claim a segment.
          </p>
        </div>

        {/* ── Overall progress ── */}
        {!loading && zipcodes.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{overallPct}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span><span className="font-semibold text-green-600">{totalCompleted}</span> completed</span>
              <span><span className="font-semibold text-amber-500">{zipcodes.reduce((a,z)=>a+z.in_progress,0)}</span> in progress</span>
              <span><span className="font-semibold text-gray-400">{zipcodes.reduce((a,z)=>a+z.not_started,0)}</span> not started</span>
            </div>
          </div>
        )}

        {/* ── Zipcode grid grouped by city ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([city, rows]) => (
              <div key={city}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                  {city}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rows.map(z => {
                    const compPct = pct(z.completed, z.segment_count)
                    const ipPct   = pct(z.in_progress, z.segment_count)
                    const nsPct   = pct(z.not_started, z.segment_count)
                    const allDone = z.segment_count > 0 && z.not_started === 0 && z.in_progress === 0

                    return (
                      <Link
                        key={z.zipcode}
                        href={`/${z.zipcode}`}
                        className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {z.zipcode}
                            </p>
                            <p className="text-xs text-gray-400">{z.total_pages.toLocaleString()} total pages</p>
                          </div>
                          {allDone ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              ✓ Done
                            </span>
                          ) : z.segment_count === 0 ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                              Open
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {compPct}%
                            </span>
                          )}
                        </div>

                        {/* Segmented progress bar */}
                        <div className="h-2 w-full rounded-full overflow-hidden flex gap-0.5 mb-3">
                          {z.segment_count === 0 ? (
                            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full" />
                          ) : (
                            <>
                              {compPct > 0 && <div className="bg-green-500 rounded-l-full" style={{ width: `${compPct}%` }} />}
                              {ipPct   > 0 && <div className="bg-amber-400"               style={{ width: `${ipPct}%` }} />}
                              {nsPct   > 0 && <div className="bg-gray-200 dark:bg-gray-700 rounded-r-full" style={{ width: `${nsPct}%` }} />}
                            </>
                          )}
                        </div>

                        {/* Segment counts */}
                        <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{z.segment_count} segment{z.segment_count !== 1 ? "s" : ""}</span>
                          {z.completed   > 0 && <span className="text-green-600">{z.completed} done</span>}
                          {z.in_progress > 0 && <span className="text-amber-500">{z.in_progress} active</span>}
                          {z.not_started > 0 && <span className="text-gray-400">{z.not_started} open</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

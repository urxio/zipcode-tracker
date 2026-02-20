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

function pct(a: number, total: number) {
  return total > 0 ? Math.round((a / total) * 100) : 0
}

// ── Name Picker Modal ─────────────────────────────────────────────────────────
function NamePickerModal({
  knownUsers,
  onSelect,
}: {
  knownUsers: string[]
  onSelect: (name: string) => void
}) {
  const [newName, setNewName] = useState("")
  const [tab, setTab] = useState<"pick" | "new">(knownUsers.length > 0 ? "pick" : "new")

  const submit = () => {
    const n = newName.trim()
    if (n) onSelect(n)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Who are you?</h2>
          <p className="text-sm text-gray-400 mt-0.5">Pick your name to track your segments.</p>
        </div>

        {/* Tab switcher */}
        {knownUsers.length > 0 && (
          <div className="flex gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 mx-6 mt-4 rounded-xl">
            {(["pick", "new"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.65)]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t === "pick" ? "Select existing" : "New user"}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-5">
          {tab === "pick" ? (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {knownUsers.map(name => (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-medium text-gray-800 dark:text-gray-200 transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Enter your name…"
                className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={submit}
                disabled={!newName.trim()}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Add Zipcode Modal ─────────────────────────────────────────────────────────
function AddZipcodeModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: () => void
}) {
  const [city, setCity]           = useState("")
  const [zipcode, setZipcode]     = useState("")
  const [totalPages, setTotalPages] = useState("")
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState("")

  const submit = async () => {
    setError("")
    const pages = parseInt(totalPages)
    if (!city.trim() || !zipcode.trim() || !pages || pages < 1) {
      setError("All fields are required and total pages must be > 0.")
      return
    }
    setSaving(true)
    const res = await fetch("/api/zipcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.trim(), zipcode: zipcode.trim(), total_pages: pages }),
    })
    setSaving(false)
    if (res.ok) {
      onAdded()
      onClose()
    } else {
      const d = await res.json()
      setError(d.error ?? "Failed to add zipcode.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Zipcode</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">City</label>
            <input
              autoFocus
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Alexandria"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Zipcode</label>
            <input
              value={zipcode}
              onChange={e => setZipcode(e.target.value)}
              placeholder="e.g. 22314"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Total pages in A-Z</label>
            <input
              type="number"
              value={totalPages}
              onChange={e => setTotalPages(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="e.g. 800"
              min={1}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {saving ? "Adding…" : "Add Zipcode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [zipcodes, setZipcodes]       = useState<ZipcodeRow[]>([])
  const [loading, setLoading]         = useState(true)
  const [userName, setUserName]       = useState("")
  const [knownUsers, setKnownUsers]   = useState<string[]>([])
  const [showPicker, setShowPicker]   = useState(false)
  const [showAddZip, setShowAddZip]   = useState(false)
  const [hydrated, setHydrated]       = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("zt_user")
    if (saved) setUserName(saved)
    setHydrated(true)

    loadZipcodes()

    fetch("/api/users")
      .then(r => r.json())
      .then((data: string[]) => {
        setKnownUsers(data)
        // Show picker if no name saved yet
        if (!saved) setShowPicker(true)
      })
      .catch(() => {
        if (!saved) setShowPicker(true)
      })
  }, [])

  const loadZipcodes = () => {
    fetch("/api/zipcodes")
      .then(r => r.json())
      .then(data => { setZipcodes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const selectName = (name: string) => {
    localStorage.setItem("zt_user", name)
    setUserName(name)
    setShowPicker(false)
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

      {/* Modals */}
      {showPicker && hydrated && (
        <NamePickerModal knownUsers={knownUsers} onSelect={selectName} />
      )}
      {showAddZip && (
        <AddZipcodeModal
          onClose={() => setShowAddZip(false)}
          onAdded={() => { setLoading(true); loadZipcodes() }}
        />
      )}

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">Zipcode Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            {hydrated && userName ? (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Signed in as</span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  {userName}
                </span>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  Change
                </button>
              </>
            ) : (
              hydrated && (
                <button
                  onClick={() => setShowPicker(true)}
                  className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                >
                  Sign in
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Lacy Boulevard Territory Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track page-range assignments across all zipcodes. Click a zipcode to view or claim a segment.
            </p>
          </div>
          <button
            onClick={() => setShowAddZip(true)}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Add Zipcode
          </button>
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
              <span><span className="font-semibold text-amber-500">{zipcodes.reduce((a, z) => a + z.in_progress, 0)}</span> in progress</span>
              <span><span className="font-semibold text-gray-400">{zipcodes.reduce((a, z) => a + z.not_started, 0)}</span> not started</span>
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
                    const compPct = pct(z.completed,   z.segment_count)
                    const ipPct   = pct(z.in_progress, z.segment_count)
                    const nsPct   = pct(z.not_started, z.segment_count)
                    const allDone = z.segment_count > 0 && z.not_started === 0 && z.in_progress === 0

                    return (
                      <Link
                        key={z.zipcode}
                        href={`/${z.zipcode}`}
                        className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {z.zipcode}
                            </p>
                            <p className="text-xs text-gray-400">{z.total_pages.toLocaleString()} pages</p>
                          </div>
                          {allDone ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">✓ Done</span>
                          ) : z.segment_count === 0 ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Open</span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">{compPct}%</span>
                          )}
                        </div>

                        {/* Segmented progress bar */}
                        <div className="h-2 w-full rounded-full overflow-hidden flex gap-0.5 mb-3">
                          {z.segment_count === 0 ? (
                            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full" />
                          ) : (
                            <>
                              {compPct > 0 && <div className="bg-green-500 rounded-l-full" style={{ width: `${compPct}%` }} />}
                              {ipPct   > 0 && <div className="bg-amber-400"               style={{ width: `${ipPct}%`  }} />}
                              {nsPct   > 0 && <div className="bg-gray-200 dark:bg-gray-700 rounded-r-full" style={{ width: `${nsPct}%` }} />}
                            </>
                          )}
                        </div>

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

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

type MySegment = {
  id: number
  page_start: number
  page_end: number | null
  owner: string
  stopped_at_page: number | null
  status: string
  notes: string
  updated_at: string
  city: string
  zipcode: string
  total_pages: number
}

function pct(a: number, total: number) {
  return total > 0 ? Math.round((a / total) * 100) : 0
}

const STATUS_STYLES: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "In progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Not started": "bg-gray-100  text-gray-500  dark:bg-gray-800     dark:text-gray-400",
}

const FEATURES = [
  { icon: "📍", title: "Territory dashboard", desc: "All zipcodes grouped by city with live segmented progress bars." },
  { icon: "📋", title: "Your segments at a glance", desc: "Active and not-started segments shown front and centre after sign-in." },
  { icon: "✋", title: "Claim a page range", desc: "Open any zipcode and claim a start–end page range in one tap." },
  { icon: "✏️", title: "Update your progress", desc: "Set the page you stopped at and flip the status right from the dashboard." },
  { icon: "📊", title: "Live progress tracking", desc: "Bars update in real time across all territories as work is logged." },
]

// ── Welcome card (shown to unsigned-in users) ─────────────────────────────────
function WelcomeCard({ knownUsers, onSelect }: { knownUsers: string[]; onSelect: (name: string) => void }) {
  const [showSignIn, setShowSignIn] = useState(false)
  const [tab, setTab]       = useState<"pick" | "new">(knownUsers.length > 0 ? "pick" : "new")
  const [newName, setNewName] = useState("")

  const submit = () => { const n = newName.trim(); if (n) onSelect(n) }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 text-center border-b border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-2xl mb-3">📍</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to Zipcode Tracker</h2>
          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
            The Lacy Boulevard team&apos;s A-Z page tracker.
          </p>
        </div>

        {/* Feature list */}
        {!showSignIn && (
          <div className="px-7 py-5 flex flex-col gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm">{f.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{f.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sign-in form (revealed on button click) */}
        {showSignIn && (
          <div className="px-7 py-5">
            {knownUsers.length > 0 && (
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
                {(["pick", "new"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.65)]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                    {t === "pick" ? "Select existing" : "New user"}
                  </button>
                ))}
              </div>
            )}
            {tab === "pick" ? (
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                {knownUsers.map(name => (
                  <button key={name} onClick={() => onSelect(name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-medium text-gray-800 dark:text-gray-200 transition-all">
                    {name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder="Enter your name…"
                  className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button onClick={submit} disabled={!newName.trim()}
                  className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="px-7 pb-7 pt-2">
          {!showSignIn ? (
            <button onClick={() => setShowSignIn(true)}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm">
              Sign in to get started →
            </button>
          ) : (
            <button onClick={() => setShowSignIn(false)}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors pt-1">
              ← Back to overview
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Name Picker Modal (for "Change" from nav when already signed in) ───────────
function NamePickerModal({ knownUsers, onSelect }: { knownUsers: string[]; onSelect: (name: string) => void }) {
  const [newName, setNewName] = useState("")
  const [tab, setTab] = useState<"pick" | "new">(knownUsers.length > 0 ? "pick" : "new")
  const submit = () => { const n = newName.trim(); if (n) onSelect(n) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Who are you?</h2>
          <p className="text-sm text-gray-400 mt-0.5">Pick your name to track your segments.</p>
        </div>
        {knownUsers.length > 0 && (
          <div className="flex gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 mx-6 mt-4 rounded-xl">
            {(["pick", "new"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-indigo-600 text-white shadow-[0_0_14px_rgba(99,102,241,0.65)]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {t === "pick" ? "Select existing" : "New user"}
              </button>
            ))}
          </div>
        )}
        <div className="px-6 py-5">
          {tab === "pick" ? (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {knownUsers.map(name => (
                <button key={name} onClick={() => onSelect(name)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-medium text-gray-800 dark:text-gray-200 transition-all">
                  {name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Enter your name…"
                className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button onClick={submit} disabled={!newName.trim()}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
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
function AddZipcodeModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [city, setCity] = useState("")
  const [zipcode, setZipcode] = useState("")
  const [totalPages, setTotalPages] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    setError("")
    const pages = parseInt(totalPages)
    if (!city.trim() || !zipcode.trim() || !pages || pages < 1) { setError("All fields are required."); return }
    setSaving(true)
    const res = await fetch("/api/zipcodes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city: city.trim(), zipcode: zipcode.trim(), total_pages: pages }) })
    setSaving(false)
    if (res.ok) { onAdded(); onClose() } else { const d = await res.json(); setError(d.error ?? "Failed to add zipcode.") }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Zipcode</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {[["City", city, setCity, "e.g. Alexandria"], ["Zipcode", zipcode, setZipcode, "e.g. 22314"]].map(([label, val, setter, ph]) => (
            <div key={label as string}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label as string}</label>
              <input value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Total pages in A-Z</label>
            <input type="number" value={totalPages} onChange={e => setTotalPages(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="e.g. 800" min={1}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={submit} disabled={saving} className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">{saving ? "Adding…" : "Add Zipcode"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── My Segments Panel ─────────────────────────────────────────────────────────
function MySegmentsPanel({ userName }: { userName: string }) {
  const [segments, setSegments]         = useState<MySegment[]>([])
  const [loading, setLoading]           = useState(true)
  const [editing, setEditing]           = useState<Record<number, { stopped_at_page: string; status: string }>>({})
  const [saving, setSaving]             = useState<Set<number>>(new Set())
  const [completedOpen, setCompletedOpen] = useState(false)

  const load = () => {
    setLoading(true)
    fetch(`/api/segments/mine?owner=${encodeURIComponent(userName)}`)
      .then(r => r.json())
      .then(data => { setSegments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (userName) load() }, [userName])

  const startEdit  = (seg: MySegment) =>
    setEditing(prev => ({ ...prev, [seg.id]: { stopped_at_page: seg.stopped_at_page?.toString() ?? "", status: seg.status } }))
  const cancelEdit = (id: number) =>
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n })

  const saveEdit = async (id: number) => {
    const e = editing[id]; if (!e) return
    setSaving(prev => new Set(prev).add(id))
    const res = await fetch("/api/segments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stopped_at_page: e.stopped_at_page ? parseInt(e.stopped_at_page) : null, status: e.status }),
    })
    setSaving(prev => { const s = new Set(prev); s.delete(id); return s })
    if (res.ok) { cancelEdit(id); load() }
  }

  if (loading) return (
    <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
    </div>
  )

  if (segments.length === 0) return (
    <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your segments</p>
      <p className="text-sm text-gray-400">You don&apos;t have any segments yet. Open a zipcode and claim a page range!</p>
    </div>
  )

  const inProgress = segments.filter(s => s.status === "In progress")
  const notStarted = segments.filter(s => s.status === "Not started")
  const completed  = segments.filter(s => s.status === "Completed")
  const active     = [...inProgress, ...notStarted]

  const SegRow = ({ seg }: { seg: MySegment }) => {
    const isEditing = !!editing[seg.id]
    const isSaving  = saving.has(seg.id)
    return (
      <tr className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30">
        <td className="px-5 py-3">
          <Link href={`/${seg.zipcode}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-xs">
            {seg.city} {seg.zipcode}
          </Link>
        </td>
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-sm">
          {seg.page_start}{seg.page_end ? ` – ${seg.page_end}` : "+"}
        </td>
        <td className="px-4 py-3 text-gray-500 text-sm">
          {isEditing ? (
            <input type="number" value={editing[seg.id].stopped_at_page}
              onChange={e => setEditing(prev => ({ ...prev, [seg.id]: { ...prev[seg.id], stopped_at_page: e.target.value } }))}
              className="w-20 h-7 px-2 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="page #" />
          ) : (seg.stopped_at_page ?? "—")}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select value={editing[seg.id].status} onChange={e => setEditing(prev => ({ ...prev, [seg.id]: { ...prev[seg.id], status: e.target.value } }))}
              className="h-7 px-2 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400">
              <option>Not started</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
          ) : (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[seg.status] ?? STATUS_STYLES["Not started"]}`}>
              {seg.status}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <div className="flex gap-1.5">
              <button onClick={() => saveEdit(seg.id)} disabled={isSaving}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors">
                {isSaving ? "…" : "Save"}
              </button>
              <button onClick={() => cancelEdit(seg.id)}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => startEdit(seg)}
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 dark:bg-gray-800 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors">
              Update
            </button>
          )}
        </td>
      </tr>
    )
  }

  return (
    <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Your segments
          <span className="ml-2 text-xs font-normal text-gray-400">({segments.length})</span>
        </span>
        <div className="flex gap-3 text-xs text-gray-400">
          {inProgress.length > 0 && <span className="text-amber-500 font-medium">{inProgress.length} in progress</span>}
          {notStarted.length > 0 && <span>{notStarted.length} not started</span>}
          {completed.length  > 0 && <span className="text-green-600 font-medium">{completed.length} done</span>}
        </div>
      </div>

      {/* Active segments table (In progress + Not started) */}
      {active.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Zipcode</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Pages</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stopped at</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {active.map(seg => <SegRow key={seg.id} seg={seg} />)}
            </tbody>
          </table>
        </div>
      )}

      {active.length === 0 && completed.length > 0 && (
        <p className="px-5 py-4 text-sm text-gray-400">All your segments are completed 🎉</p>
      )}

      {/* Completed dropdown */}
      {completed.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setCompletedOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Completed ({completed.length})
            </span>
            <span className={`transition-transform duration-200 ${completedOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
          {completedOpen && (
            <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
              <table className="w-full text-sm">
                <tbody>
                  {completed.map(seg => <SegRow key={seg.id} seg={seg} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [zipcodes, setZipcodes]     = useState<ZipcodeRow[]>([])
  const [loading, setLoading]       = useState(true)
  const [userName, setUserName]     = useState("")
  const [knownUsers, setKnownUsers] = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [showAddZip, setShowAddZip] = useState(false)
  const [hydrated, setHydrated]     = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("zt_user")
    if (saved) setUserName(saved)
    setHydrated(true)
    loadZipcodes()
    fetch("/api/users")
      .then(r => r.json())
      .then((data: string[]) => setKnownUsers(data))
      .catch(() => {})
  }, [])

  const loadZipcodes = () => {
    fetch("/api/zipcodes")
      .then(r => r.json())
      .then(data => { setZipcodes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const selectName = (name: string) => {
    localStorage.setItem("zt_user", name)
    localStorage.setItem("zt_seen_overview", "1")
    setUserName(name)
    setShowPicker(false)
  }

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

  // Show welcome card for unsigned-in users (after hydration)
  const showWelcome = hydrated && !userName

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Welcome card overlay for new / unsigned-in users */}
      {showWelcome && <WelcomeCard knownUsers={knownUsers} onSelect={selectName} />}

      {/* Change-name modal (for already signed-in users) */}
      {showPicker && hydrated && userName && <NamePickerModal knownUsers={knownUsers} onSelect={selectName} />}

      {showAddZip && <AddZipcodeModal onClose={() => setShowAddZip(false)} onAdded={() => { setLoading(true); loadZipcodes() }} />}

      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">Zipcode Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            {hydrated && userName ? (
              <>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  {userName}
                </span>
                <button onClick={() => setShowPicker(true)} className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                  Change
                </button>
              </>
            ) : hydrated && (
              <button onClick={() => setShowPicker(true)} className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors">
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Lacy Boulevard Territory Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track page-range assignments across all zipcodes.</p>
          </div>
          <button onClick={() => setShowAddZip(true)}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm">
            <span className="text-base leading-none">+</span> Add Zipcode
          </button>
        </div>

        {/* My segments — only shown when signed in */}
        {hydrated && userName && <MySegmentsPanel userName={userName} />}

        {/* Overall progress */}
        {!loading && zipcodes.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{overallPct}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span><span className="font-semibold text-green-600">{totalCompleted}</span> completed</span>
              <span><span className="font-semibold text-amber-500">{zipcodes.reduce((a, z) => a + z.in_progress, 0)}</span> in progress</span>
              <span><span className="font-semibold text-gray-400">{zipcodes.reduce((a, z) => a + z.not_started, 0)}</span> not started</span>
            </div>
          </div>
        )}

        {/* Zipcode grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([city, rows]) => (
              <div key={city}>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-3">
                  {city}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rows.map(z => {
                    const compPct = pct(z.completed,   z.segment_count)
                    const ipPct   = pct(z.in_progress, z.segment_count)
                    const nsPct   = pct(z.not_started, z.segment_count)
                    const allDone = z.segment_count > 0 && z.not_started === 0 && z.in_progress === 0
                    return (
                      <Link key={z.zipcode} href={`/${z.zipcode}`}
                        className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{z.zipcode}</p>
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

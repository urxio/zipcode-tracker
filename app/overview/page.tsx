"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: "📍",
    title: "Territory dashboard",
    desc: "All zipcodes are shown grouped by city, each with a live segmented progress bar — green = completed, amber = in progress, gray = open.",
  },
  {
    icon: "👤",
    title: "Sign in with your name",
    desc: "No password needed. Pick your name from the list of existing team members, or add yourself as a new user. Your name is saved so you stay signed in.",
  },
  {
    icon: "📋",
    title: "Your segments at a glance",
    desc: "Once signed in, your assigned segments appear at the top of the dashboard — sorted by in progress first — so you always know exactly where to pick up.",
  },
  {
    icon: "✋",
    title: "Claim a page range",
    desc: "Open any zipcode, scroll to the bottom and enter a start and end page to claim that range. It instantly appears in the segment table.",
  },
  {
    icon: "✏️",
    title: "Update your progress",
    desc: "Your own segments show an Update button — both on the zipcode page and directly from the dashboard. Set the page you stopped at and change the status.",
  },
  {
    icon: "➕",
    title: "Add new zipcodes",
    desc: "Use the Add Zipcode button on the dashboard to register a new territory with its city name and total A-Z page count.",
  },
  {
    icon: "📊",
    title: "Live progress tracking",
    desc: "Progress bars update in real time as segments are claimed and completed. The overall bar at the top shows the big picture across all territories.",
  },
]

export default function OverviewPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    // Mark that the user has seen the overview so the main page won't redirect back
    localStorage.setItem("zt_seen_overview", "1")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">Zipcode Tracker</span>
          </div>
          <button onClick={handleGetStarted} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Go to Dashboard →
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-3xl mb-4">
            📍
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to Zipcode Tracker
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            This tool helps the Lacy Boulevard team track A-Z page assignments across all territories.
            Here&apos;s everything you need to know.
          </p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-3 mb-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{f.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Get started →
          </button>
        </div>
      </main>
    </div>
  )
}

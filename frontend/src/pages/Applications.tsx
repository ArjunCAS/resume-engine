import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { listApplications } from '../api/client'
import type { Application } from '../types'
import ApplicationTable from '../components/ApplicationTable'

const TABS = ['all', 'applied', 'screen', 'interview', 'offer', 'rejected'] as const

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([])
  const [tab, setTab] = useState<string>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    listApplications({
      status: tab === 'all' ? undefined : tab,
      search: search || undefined,
    }).then(setApps)
  }, [tab, search])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
        <Link
          to="/applications/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add New
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search company or role..."
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ApplicationTable applications={apps} onRefresh={load} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getReminders, getRecent } from '../api/client'
import type { DashboardStats, ReminderItem, Application } from '../types'
import StatsCards from '../components/StatsCards'
import ReminderBanner from '../components/ReminderBanner'
import ApplicationCard from '../components/ApplicationCard'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [recent, setRecent] = useState<Application[]>([])

  useEffect(() => {
    getStats().then(setStats)
    getReminders().then(setReminders)
    getRecent().then(setRecent)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <Link
          to="/applications/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Application
        </Link>
      </div>

      <ReminderBanner reminders={reminders} />

      {stats && <StatsCards stats={stats} />}

      <section>
        <h3 className="mb-3 text-lg font-semibold text-gray-800">Recent Activity</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">No applications yet. Add your first one!</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

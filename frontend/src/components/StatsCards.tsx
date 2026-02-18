import type { DashboardStats } from '../types'

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  const { by_status, total, applied_this_week } = stats
  const inProgress = (by_status['applied'] ?? 0) + (by_status['screen'] ?? 0)
  const interviews = by_status['interview'] ?? 0
  const offers = by_status['offer'] ?? 0
  const rejected = by_status['rejected'] ?? 0
  const responseRate = total > 0
    ? Math.round(((interviews + offers + (by_status['screen'] ?? 0)) / total) * 100)
    : 0

  const cards = [
    { label: 'Total Applied', value: total, color: 'bg-blue-50 text-blue-700' },
    { label: 'In Progress', value: inProgress, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Interviews', value: interviews, color: 'bg-purple-50 text-purple-700' },
    { label: 'Offers', value: offers, color: 'bg-green-50 text-green-700' },
    { label: 'Response Rate', value: `${responseRate}%`, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'This Week', value: applied_this_week, color: 'bg-cyan-50 text-cyan-700' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg p-4 ${c.color}`}>
          <p className="text-sm font-medium">{c.label}</p>
          <p className="mt-1 text-2xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  )
}

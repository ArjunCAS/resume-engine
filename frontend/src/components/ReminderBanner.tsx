import { Link } from 'react-router-dom'
import type { ReminderItem } from '../types'

export default function ReminderBanner({ reminders }: { reminders: ReminderItem[] }) {
  if (reminders.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h3 className="font-semibold text-amber-800">
        {reminders.length} application{reminders.length > 1 ? 's' : ''} need follow-up
      </h3>
      <ul className="mt-2 space-y-1">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-center justify-between text-sm">
            <span className="text-amber-900">
              <strong>{r.company}</strong> &mdash; {r.role_title}{' '}
              <span className="text-amber-600">({r.days_since_update}d ago, {r.status})</span>
            </span>
            <Link
              to={`/applications/${r.id}/edit`}
              className="rounded bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900 hover:bg-amber-300"
            >
              Update
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

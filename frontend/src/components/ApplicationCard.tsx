import { Link } from 'react-router-dom'
import type { Application } from '../types'
import StatusBadge from './StatusBadge'

export default function ApplicationCard({ app }: { app: Application }) {
  return (
    <Link
      to={`/applications/${app.id}/edit`}
      className="block rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">{app.company}</p>
          <p className="text-sm text-gray-600">{app.role_title}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      {app.applied_date && (
        <p className="mt-2 text-xs text-gray-400">
          Applied {new Date(app.applied_date).toLocaleDateString()}
        </p>
      )}
    </Link>
  )
}

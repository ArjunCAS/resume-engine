import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Application } from '../types'
import StatusBadge from './StatusBadge'
import StatusUpdateModal from './StatusUpdateModal'
import { updateStatus, deleteApplication, resumeUrl } from '../api/client'

interface Props {
  applications: Application[]
  onRefresh: () => void
}

export default function ApplicationTable({ applications, onRefresh }: Props) {
  const [statusModal, setStatusModal] = useState<Application | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  async function handleStatusUpdate(status: string, note: string) {
    if (!statusModal) return
    await updateStatus(statusModal.id, status, note || undefined)
    setStatusModal(null)
    onRefresh()
  }

  async function handleDelete(id: number, company: string) {
    if (!confirm(`Delete application for ${company}?`)) return
    await deleteApplication(id)
    onRefresh()
  }

  if (applications.length === 0) {
    return <p className="py-8 text-center text-gray-500">No applications found.</p>
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Applied</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <>
                <tr
                  key={app.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                >
                  <td className="px-3 py-2 font-medium text-gray-900">{app.company}</td>
                  <td className="px-3 py-2 text-gray-700">{app.role_title}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-500">{app.source ?? '—'}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                        onClick={() => setStatusModal(app)}
                      >
                        Status
                      </button>
                      <Link
                        to={`/applications/${app.id}/edit`}
                        className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        Edit
                      </Link>
                      {app.resume_filename && (
                        <a
                          href={resumeUrl(app.id)}
                          className="rounded px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Resume
                        </a>
                      )}
                      <button
                        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(app.id, app.company)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded === app.id && (
                  <tr key={`${app.id}-detail`}>
                    <td colSpan={6} className="bg-gray-50 px-4 py-3">
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        {app.url && (
                          <p>
                            <strong>URL:</strong>{' '}
                            <a href={app.url} target="_blank" className="text-blue-600 underline" rel="noopener noreferrer">
                              {app.url}
                            </a>
                          </p>
                        )}
                        {app.location && <p><strong>Location:</strong> {app.location}</p>}
                        {app.job_type && <p><strong>Type:</strong> {app.job_type}</p>}
                        {app.salary_range && <p><strong>Salary:</strong> {app.salary_range}</p>}
                        {app.contact_person && <p><strong>Contact:</strong> {app.contact_person}</p>}
                        {app.contact_email && <p><strong>Email:</strong> {app.contact_email}</p>}
                        {app.notes && (
                          <div className="sm:col-span-2">
                            <strong>Notes:</strong>
                            <p className="mt-1 whitespace-pre-wrap text-gray-600">{app.notes}</p>
                          </div>
                        )}
                        {app.jd_text && (
                          <div className="sm:col-span-2">
                            <strong>Job Description:</strong>
                            <p className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap text-gray-600">
                              {app.jd_text}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {statusModal && (
        <StatusUpdateModal
          currentStatus={statusModal.status}
          onUpdate={handleStatusUpdate}
          onClose={() => setStatusModal(null)}
        />
      )}
    </>
  )
}

import { useState } from 'react'
import type { Status } from '../types'

const STATUSES: Status[] = ['draft', 'applied', 'screen', 'interview', 'offer', 'rejected', 'withdrawn']

interface Props {
  currentStatus: string
  onUpdate: (status: string, note: string) => void
  onClose: () => void
}

export default function StatusUpdateModal({ currentStatus, onUpdate, onClose }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
        <select
          className="w-full rounded border border-gray-300 p-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <textarea
          className="mt-3 w-full rounded border border-gray-300 p-2 text-sm"
          rows={2}
          placeholder="Optional note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            onClick={() => onUpdate(status, note)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createApplication, getApplication, updateApplication } from '../api/client'
import type { StatusHistoryEntry } from '../types'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['draft', 'applied', 'screen', 'interview', 'offer', 'rejected', 'withdrawn']
const JOB_TYPES = ['', 'remote', 'hybrid', 'onsite']
const SOURCES = ['', 'linkedin', 'naukri', 'company-site', 'referral', 'other']

export default function AddApplication() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    company: '',
    role_title: '',
    url: '',
    jd_text: '',
    status: 'draft',
    salary_range: '',
    location: '',
    job_type: '',
    notes: '',
    applied_date: '',
    source: '',
    contact_person: '',
    contact_email: '',
  })
  const [resume, setResume] = useState<File | null>(null)
  const [history, setHistory] = useState<StatusHistoryEntry[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      getApplication(Number(id)).then((app) => {
        setForm({
          company: app.company,
          role_title: app.role_title,
          url: app.url ?? '',
          jd_text: app.jd_text ?? '',
          status: app.status,
          salary_range: app.salary_range ?? '',
          location: app.location ?? '',
          job_type: app.job_type ?? '',
          notes: app.notes ?? '',
          applied_date: app.applied_date ? app.applied_date.slice(0, 16) : '',
          source: app.source ?? '',
          contact_person: app.contact_person ?? '',
          contact_email: app.contact_email ?? '',
        })
        setHistory(app.status_history)
      })
    }
  }, [id])

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(applyNow: boolean) {
    setSaving(true)
    try {
      if (isEdit) {
        const data = { ...form }
        if (applyNow && form.status === 'draft') {
          data.status = 'applied'
          data.applied_date = new Date().toISOString()
        }
        await updateApplication(Number(id), data)
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => {
          if (v) fd.append(k, v)
        })
        if (applyNow && form.status === 'draft') {
          fd.set('status', 'applied')
          fd.set('applied_date', new Date().toISOString())
        }
        if (resume) fd.append('resume', resume)
        await createApplication(fd)
      }
      navigate('/applications')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {isEdit ? 'Edit Application' : 'Add Application'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company *</label>
          <input className={inputCls} value={form.company} onChange={set('company')} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Role Title *</label>
          <input className={inputCls} value={form.role_title} onChange={set('role_title')} required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Job URL</label>
          <input className={inputCls} value={form.url} onChange={set('url')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select className={inputCls} value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Applied Date</label>
          <input type="datetime-local" className={inputCls} value={form.applied_date} onChange={set('applied_date')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
          <input className={inputCls} value={form.location} onChange={set('location')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Job Type</label>
          <select className={inputCls} value={form.job_type} onChange={set('job_type')}>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t ? t.charAt(0).toUpperCase() + t.slice(1) : '—'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Salary Range</label>
          <input className={inputCls} value={form.salary_range} onChange={set('salary_range')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
          <select className={inputCls} value={form.source} onChange={set('source')}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Contact Person</label>
          <input className={inputCls} value={form.contact_person} onChange={set('contact_person')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="email" className={inputCls} value={form.contact_email} onChange={set('contact_email')} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Job Description</label>
          <textarea className={inputCls} rows={5} value={form.jd_text} onChange={set('jd_text')} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
          <textarea className={inputCls} rows={3} value={form.notes} onChange={set('notes')} />
        </div>
        {!isEdit && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              className="text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          disabled={saving || !form.company || !form.role_title}
          onClick={() => handleSubmit(false)}
        >
          {isEdit ? 'Save Changes' : 'Save as Draft'}
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={saving || !form.company || !form.role_title}
          onClick={() => handleSubmit(true)}
        >
          {isEdit ? 'Save' : 'Mark as Applied'}
        </button>
      </div>

      {history.length > 0 && (
        <section>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Status History</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-gray-400">
                  {new Date(h.changed_at).toLocaleString()}
                </span>
                {h.old_status && <StatusBadge status={h.old_status} />}
                <span className="text-gray-400">&rarr;</span>
                <StatusBadge status={h.new_status} />
                {h.note && <span className="text-gray-500">— {h.note}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

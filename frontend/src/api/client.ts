import type { Application, ApplicationDetail, DashboardStats, ReminderItem } from '../types'

const BASE = '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status}: ${body}`)
  }
  return res.json()
}

// Applications
export function listApplications(params?: {
  status?: string
  sort?: string
  search?: string
}): Promise<Application[]> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.sort) qs.set('sort', params.sort)
  if (params?.search) qs.set('search', params.search)
  const query = qs.toString()
  return request(`/applications${query ? `?${query}` : ''}`)
}

export function getApplication(id: number): Promise<ApplicationDetail> {
  return request(`/applications/${id}`)
}

export async function createApplication(data: FormData): Promise<Application> {
  const res = await fetch(`${BASE}/applications`, { method: 'POST', body: data })
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  return res.json()
}

export function updateApplication(
  id: number,
  data: Record<string, unknown>,
): Promise<Application> {
  return request(`/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateStatus(
  id: number,
  status: string,
  note?: string,
): Promise<Application> {
  return request(`/applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  })
}

export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${BASE}/applications/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
}

export function resumeUrl(id: number): string {
  return `${BASE}/applications/${id}/resume`
}

// Dashboard
export function getStats(): Promise<DashboardStats> {
  return request('/dashboard/stats')
}

export function getReminders(): Promise<ReminderItem[]> {
  return request('/dashboard/reminders')
}

export function getRecent(): Promise<Application[]> {
  return request('/dashboard/recent')
}

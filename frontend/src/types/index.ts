export type Status =
  | 'draft'
  | 'applied'
  | 'screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export type JobType = 'remote' | 'hybrid' | 'onsite'
export type Source = 'linkedin' | 'naukri' | 'company-site' | 'referral' | 'other'

export interface Application {
  id: number
  company: string
  role_title: string
  url: string | null
  jd_text: string | null
  resume_filename: string | null
  status: Status
  salary_range: string | null
  location: string | null
  job_type: string | null
  notes: string | null
  applied_date: string | null
  source: string | null
  contact_person: string | null
  contact_email: string | null
  created_at: string
  updated_at: string
}

export interface StatusHistoryEntry {
  id: number
  old_status: string | null
  new_status: string
  note: string | null
  changed_at: string
}

export interface ApplicationDetail extends Application {
  status_history: StatusHistoryEntry[]
}

export interface DashboardStats {
  total: number
  by_status: Record<string, number>
  applied_this_week: number
}

export interface ReminderItem {
  id: number
  company: string
  role_title: string
  status: string
  last_change: string
  days_since_update: number
}

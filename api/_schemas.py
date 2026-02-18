from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ApplicationBase(BaseModel):
    company: str
    role_title: str
    url: Optional[str] = None
    jd_text: Optional[str] = None
    status: str = "draft"
    salary_range: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None
    source: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role_title: Optional[str] = None
    url: Optional[str] = None
    jd_text: Optional[str] = None
    status: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None
    source: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None


class StatusHistoryOut(BaseModel):
    id: int
    old_status: Optional[str]
    new_status: str
    note: Optional[str]
    changed_at: datetime

    model_config = {"from_attributes": True}


class ApplicationOut(ApplicationBase):
    id: int
    resume_filename: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ApplicationDetail(ApplicationOut):
    status_history: list[StatusHistoryOut] = []


class DashboardStats(BaseModel):
    total: int
    by_status: dict[str, int]
    applied_this_week: int


class ReminderItem(BaseModel):
    id: int
    company: str
    role_title: str
    status: str
    last_change: datetime
    days_since_update: int

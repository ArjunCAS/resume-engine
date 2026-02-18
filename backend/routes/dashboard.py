from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone

from db.database import get_db
from db.models import Application, StatusHistory
from schemas import DashboardStats, ReminderItem, ApplicationOut

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

ACTIVE_STATUSES = {"applied", "screen", "interview"}


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Application.id)).scalar()

    rows = (
        db.query(Application.status, func.count(Application.id))
        .group_by(Application.status)
        .all()
    )
    by_status = {status: count for status, count in rows}

    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    applied_this_week = (
        db.query(func.count(Application.id))
        .filter(Application.applied_date >= week_ago)
        .scalar()
    )

    return DashboardStats(
        total=total, by_status=by_status, applied_this_week=applied_this_week
    )


@router.get("/reminders", response_model=list[ReminderItem])
def get_reminders(db: Session = Depends(get_db)):
    cutoff = datetime.now(timezone.utc) - timedelta(days=3)
    now = datetime.now(timezone.utc)

    apps = (
        db.query(Application)
        .filter(Application.status.in_(ACTIVE_STATUSES))
        .filter(Application.updated_at <= cutoff)
        .order_by(Application.updated_at.asc())
        .all()
    )

    reminders = []
    for app in apps:
        delta = now - app.updated_at.replace(tzinfo=timezone.utc)
        reminders.append(
            ReminderItem(
                id=app.id,
                company=app.company,
                role_title=app.role_title,
                status=app.status,
                last_change=app.updated_at,
                days_since_update=delta.days,
            )
        )
    return reminders


@router.get("/recent", response_model=list[ApplicationOut])
def get_recent(db: Session = Depends(get_db)):
    return (
        db.query(Application).order_by(Application.updated_at.desc()).limit(5).all()
    )

from sqlalchemy import Column, Integer, String, Text, DateTime, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship, deferred
from datetime import datetime, timezone

from .database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200), nullable=False)
    role_title = Column(String(200), nullable=False)
    url = Column(String(500))
    jd_text = Column(Text)
    resume_filename = Column(String(500))  # Original filename for display
    resume_data = deferred(Column(LargeBinary))  # PDF binary content
    status = Column(String(50), default="draft")
    salary_range = Column(String(100))
    location = Column(String(200))
    job_type = Column(String(50))
    notes = Column(Text)
    applied_date = Column(DateTime)
    source = Column(String(100))
    contact_person = Column(String(200))
    contact_email = Column(String(200))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    status_history = relationship(
        "StatusHistory", back_populates="application", cascade="all, delete-orphan"
    )


class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    old_status = Column(String(50))
    new_status = Column(String(50), nullable=False)
    note = Column(Text)
    changed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="status_history")

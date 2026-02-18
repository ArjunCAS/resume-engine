from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timezone
from typing import Optional

from db.database import get_db
from db.models import Application, StatusHistory
from schemas import (
    ApplicationUpdate,
    ApplicationOut,
    ApplicationDetail,
    StatusUpdate,
)

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.get("", response_model=list[ApplicationOut])
def list_applications(
    status: Optional[str] = None,
    sort: str = "date",
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Application)

    if status:
        query = query.filter(Application.status == status)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Application.company.ilike(term),
                Application.role_title.ilike(term),
                Application.notes.ilike(term),
            )
        )

    if sort == "company":
        query = query.order_by(Application.company)
    else:
        query = query.order_by(Application.updated_at.desc())

    return query.all()


@router.post("", response_model=ApplicationOut)
async def create_application(
    company: str = Form(...),
    role_title: str = Form(...),
    url: Optional[str] = Form(None),
    jd_text: Optional[str] = Form(None),
    status: str = Form("draft"),
    salary_range: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    job_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    applied_date: Optional[str] = Form(None),
    source: Optional[str] = Form(None),
    contact_person: Optional[str] = Form(None),
    contact_email: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    resume_filename = None
    resume_data = None
    if resume and resume.filename:
        resume_filename = resume.filename
        resume_data = await resume.read()

    parsed_date = None
    if applied_date:
        try:
            parsed_date = datetime.fromisoformat(applied_date)
        except ValueError:
            pass

    app = Application(
        company=company,
        role_title=role_title,
        url=url or None,
        jd_text=jd_text or None,
        status=status,
        salary_range=salary_range or None,
        location=location or None,
        job_type=job_type or None,
        notes=notes or None,
        applied_date=parsed_date,
        source=source or None,
        contact_person=contact_person or None,
        contact_email=contact_email or None,
        resume_filename=resume_filename,
        resume_data=resume_data,
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    if status != "draft":
        history = StatusHistory(
            application_id=app.id, old_status=None, new_status=status
        )
        db.add(history)
        db.commit()

    return app


@router.get("/{app_id}", response_model=ApplicationDetail)
def get_application(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: int, data: ApplicationUpdate, db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(app, key, value)

    app.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(app)
    return app


@router.patch("/{app_id}/status", response_model=ApplicationOut)
def update_status(app_id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.status
    app.status = data.status
    app.updated_at = datetime.now(timezone.utc)

    history = StatusHistory(
        application_id=app.id,
        old_status=old_status,
        new_status=data.status,
        note=data.note,
    )
    db.add(history)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()
    return {"detail": "Deleted"}


@router.get("/{app_id}/resume")
def download_resume(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if not app.resume_data:
        raise HTTPException(status_code=404, detail="No resume uploaded")

    filename = f"{app.company}_{app.role_title}_resume.pdf"
    return Response(
        content=app.resume_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

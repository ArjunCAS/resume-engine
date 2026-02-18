import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from _db.database import engine, Base
from _routes import applications, dashboard

try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

app = FastAPI(title="Job Application Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(dashboard.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}

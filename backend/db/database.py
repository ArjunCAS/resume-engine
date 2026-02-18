from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# Vercel Postgres sets POSTGRES_URL; also check DATABASE_URL as fallback
_url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL") or ""

if _url:
    # Vercel gives postgres:// but SQLAlchemy needs postgresql://
    DATABASE_URL = _url.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    # Local dev: SQLite — use /tmp on Vercel (read-only filesystem elsewhere)
    if os.environ.get("VERCEL"):
        DB_PATH = "/tmp/tracker.db"
    else:
        DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "tracker.db")
    DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

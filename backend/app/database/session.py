from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings
from app.core.logging import logger

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        echo=False,
        future=True
    )
except Exception as e:
    logger.warning(f"Failed to connect to primary DATABASE_URL ({settings.DATABASE_URL}): {e}. Falling back to SQLite.")
    engine = create_engine(
        "sqlite:///./quantumtrace.db",
        connect_args={"check_same_thread": False},
        future=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes all database tables registered with Base."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema verified and tables initialized.")


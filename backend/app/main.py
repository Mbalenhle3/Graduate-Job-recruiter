from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import get_database
from .routers import auth, employers, job_seekers
from .routers import (
    auth,
    employer_opportunities,
    employers,
    job_seekers,
)
from .routers import (
    admins,
    auth,
    dashboards,
    employer_applications,
    employer_opportunities,
    employers,
    job_applications,
    job_seekers,
    notifications,
    appeals,
    gradbot,
    support,
)

app = FastAPI(
    title="GraduateLink SA API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.11.72.103:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(job_seekers.router)
app.include_router(employers.router)
app.include_router(employer_opportunities.router)
app.include_router(employer_applications.router)
app.include_router(job_applications.router)
app.include_router(admins.router)
app.include_router(dashboards.router)
app.include_router(notifications.router)
app.include_router(appeals.router)
app.include_router(gradbot.router)
app.include_router(support.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "GraduateLink SA backend is running",
    }


@app.get("/api/health/database")
def database_health_check(
    database: Session = Depends(get_database),
):
    database.execute(text("SELECT 1"))

    return {
        "status": "success",
        "message": "PostgreSQL is connected",
    }
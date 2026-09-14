from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from .routers.auth import router as auth_router

from .database import get_database


app = FastAPI(
    title="GraduateLink SA API",
    version="1.0.0"
)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "GraduateLink SA backend is running"
    }


@app.get("/api/health/database")
def database_health_check(
    database: Session = Depends(get_database)
):
    database.execute(text("SELECT 1"))

    return {
        "status": "success",
        "message": "PostgreSQL is connected"
    }
from datetime import date,datetime
from typing import Literal

from pydantic import BaseModel, Field


class JobApplicationResponse(BaseModel):
    id: int
    job_seeker_profile_id: int
    opportunity_id: int

    cover_letter: str | None
    resume_name: str

    status: str
    employer_notes: str | None

    submitted_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }


class JobSeekerApplicationResponse(BaseModel):
    id: int
    opportunity_id: int

    opportunity_title: str
    organisation_name: str | None
    location: str | None
    opportunity_type: str

    status: str
    resume_name: str

    submitted_at: datetime
    updated_at: datetime


class EmployerApplicantResponse(BaseModel):
    id: int
    opportunity_id: int
    opportunity_title: str

    job_seeker_profile_id: int
    first_name: str
    last_name: str
    email: str

    qualification: str | None
    institution: str | None

    resume_name: str
    cover_letter: str | None

    status: str
    employer_notes: str | None

    submitted_at: datetime
    updated_at: datetime


class ApplicationStatusUpdate(BaseModel):
    status: Literal[
        "under_review",
        "shortlisted",
        "rejected",
        "hired",
    ]

    employer_notes: str | None = Field(
        default=None,
        max_length=2000,
    )

class PublicOpportunityResponse(BaseModel):
    id: int
    employer_profile_id: int
    organisation_name: str | None

    title: str
    description: str
    requirements: str | None
    qualification: str | None

    location: str | None
    province: str | None
    work_mode: str
    opportunity_type: str
    required_experience_years: int
    closing_date: date

    status: str
    created_at: datetime
    updated_at: datetime

class SavedOpportunityResponse(BaseModel):
    id: int
    opportunity_id: int

    organisation_name: str | None
    title: str
    location: str | None
    province: str | None
    work_mode: str
    opportunity_type: str
    closing_date: date

    saved_at: datetime
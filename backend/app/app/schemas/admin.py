from datetime import date, datetime

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)
from typing import Literal

from pydantic import model_validator


class AdminProfileUpdate(BaseModel):
    first_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    last_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    job_title: str | None = Field(
        default=None,
        max_length=150,
    )

    department: str | None = Field(
        default=None,
        max_length=150,
    )


class AdminProfileResponse(BaseModel):
    id: int
    user_id: int

    first_name: str | None
    last_name: str | None
    email: EmailStr
    is_active: bool

    phone: str | None
    job_title: str | None
    department: str | None

    created_at: datetime
    updated_at: datetime

class AdminEmployerResponse(BaseModel):
    id: int
    user_id: int

    first_name: str | None
    last_name: str | None
    account_email: EmailStr
    is_active: bool

    contact_name: str | None
    organisation_name: str | None
    registration_number: str | None
    contact_email: EmailStr | None
    phone: str | None
    website: str | None
    industry: str | None
    company_size: str | None
    city: str | None
    province: str | None
    description: str | None

    verification_document_name: str | None
    verification_status: str
    verification_rejection_reason: str | None

    created_at: datetime
    updated_at: datetime


class EmployerVerificationDecision(BaseModel):
    decision: Literal[
        "approved",
        "rejected",
    ]

    reason: str | None = Field(
        default=None,
        max_length=1000,
    )

    @model_validator(mode="after")
    def rejection_requires_reason(self):
        if (
            self.decision == "rejected"
            and (
                not self.reason
                or not self.reason.strip()
            )
        ):
            raise ValueError(
                "A rejection reason is required"
            )

        return self

class AdminOpportunityResponse(BaseModel):
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
    rejection_reason: str | None

    created_at: datetime
    updated_at: datetime


class OpportunityReviewDecision(BaseModel):
    decision: Literal["approved", "rejected"]

    reason: str | None = Field(
        default=None,
        max_length=1000,
    )

class AdminUserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class UserAccountStatusUpdate(BaseModel):
    action: Literal["suspend", "activate"]

    reason: str | None = Field(
        default=None,
        max_length=1000,
    )

class AdminActivityResponse(BaseModel):
    id: int
    admin_user_id: int | None
    action: str
    target_type: str
    target_id: int | None
    description: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class AdminDashboardResponse(BaseModel):
    total_users: int
    active_users: int
    suspended_users: int

    total_job_seekers: int
    total_employers: int
    total_admins: int

    pending_employer_verifications: int
    approved_employers: int

    pending_opportunities: int
    published_opportunities: int
    rejected_opportunities: int

    recent_activities: list[AdminActivityResponse]
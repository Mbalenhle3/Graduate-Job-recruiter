from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class EmployerProfileUpdate(BaseModel):
    contact_name: str | None = Field(
        default=None,
        max_length=150,
    )

    organisation_name: str | None = Field(
        default=None,
        max_length=255,
    )

    registration_number: str | None = Field(
        default=None,
        max_length=100,
    )

    contact_email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    website: str | None = Field(
        default=None,
        max_length=500,
    )

    industry: str | None = Field(
        default=None,
        max_length=150,
    )

    company_size: str | None = Field(
        default=None,
        max_length=100,
    )

    city: str | None = Field(
        default=None,
        max_length=150,
    )

    province: str | None = Field(
        default=None,
        max_length=150,
    )

    description: str | None = None


class EmployerProfileResponse(BaseModel):
    id: int
    user_id: int

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

    model_config = {
        "from_attributes": True,
    }
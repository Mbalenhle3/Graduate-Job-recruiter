from datetime import date, datetime
from typing import Literal

from pydantic import (
    BaseModel,
    Field,
    field_validator,
)


WorkMode = Literal[
    "on_site",
    "hybrid",
    "remote",
]

OpportunityType = Literal[
    "graduate_programme",
    "internship",
    "learnership",
    "entry_level_job",
]


class OpportunityCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=255,
    )

    description: str = Field(
        min_length=30,
    )

    requirements: str | None = None

    qualification: str | None = Field(
        default=None,
        max_length=255,
    )

    location: str = Field(
        min_length=2,
        max_length=255,
    )

    province: str = Field(
        min_length=2,
        max_length=100,
    )

    work_mode: WorkMode

    opportunity_type: OpportunityType

    # GraduateLink opportunities must not require
    # previous employment experience.
    required_experience_years: int = Field(
        default=0,
        ge=0,
        le=0,
    )

    closing_date: date

    @field_validator("closing_date")
    @classmethod
    def closing_date_must_be_future(
        cls,
        value: date,
    ):
        if value <= date.today():
            raise ValueError(
                "The closing date must be in the future"
            )

        return value


class OpportunityUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        min_length=30,
    )

    requirements: str | None = None

    qualification: str | None = Field(
        default=None,
        max_length=255,
    )

    location: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    province: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    work_mode: WorkMode | None = None

    opportunity_type: OpportunityType | None = None

    required_experience_years: int | None = Field(
        default=None,
        ge=0,
        le=0,
    )

    closing_date: date | None = None

    @field_validator("closing_date")
    @classmethod
    def closing_date_must_be_future(
        cls,
        value: date | None,
    ):
        if value and value <= date.today():
            raise ValueError(
                "The closing date must be in the future"
            )

        return value


class OpportunityResponse(BaseModel):
    id: int
    employer_profile_id: int

    title: str
    description: str
    requirements: str | None
    qualification: str | None

    location: str
    province: str
    work_mode: str
    opportunity_type: str

    required_experience_years: int
    closing_date: date

    status: str
    rejection_reason: str | None

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }
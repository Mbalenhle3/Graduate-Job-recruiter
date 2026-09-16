from pydantic import BaseModel, Field


class JobSeekerProfileUpdate(BaseModel):
    full_name: str = Field(
        default="",
        max_length=150,
    )

    phone: str = Field(
        default="",
        max_length=30,
    )

    city: str = Field(
        default="",
        max_length=100,
    )

    province: str = Field(
        default="",
        max_length=100,
    )

    qualification: str = Field(
        default="",
        max_length=200,
    )

    institution: str = Field(
        default="",
        max_length=200,
    )

    study_status: str = Field(
        default="",
        max_length=50,
    )

    graduation_year: str = Field(
        default="",
        max_length=10,
    )

    professional_summary: str = Field(
        default="",
        max_length=2000,
    )

    preferred_roles: list[str] = Field(
        default_factory=list,
    )

    preferred_work_mode: str = Field(
        default="Any",
        max_length=30,
    )

    availability: str = Field(
        default="",
        max_length=50,
    )

    skills: list[str] = Field(
        default_factory=list,
    )

    projects: list[str] = Field(
        default_factory=list,
    )


class JobSeekerProfileResponse(
    JobSeekerProfileUpdate
):
    user_id: int
    cv_name: str | None = None

    model_config = {
        "from_attributes": True,
    }
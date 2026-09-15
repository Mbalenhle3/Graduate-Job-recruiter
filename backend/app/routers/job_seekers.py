from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import JobSeekerProfile, User
from ..schemas import (
    JobSeekerProfileResponse,
    JobSeekerProfileUpdate,
)


router = APIRouter(
    prefix="/api/job-seekers",
    tags=["Job Seekers"],
)


def get_or_create_profile(
    user: User,
    database: Session,
) -> JobSeekerProfile:
    profile = database.get(
        JobSeekerProfile,
        user.id,
    )

    if profile:
        return profile

    profile = JobSeekerProfile(
        user_id=user.id,
    )

    database.add(profile)
    database.commit()
    database.refresh(profile)

    return profile


@router.get(
    "/me/profile",
    response_model=JobSeekerProfileResponse,
)
def get_my_profile(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    return get_or_create_profile(
        current_user,
        database,
    )


@router.put(
    "/me/profile",
    response_model=JobSeekerProfileResponse,
)
def update_my_profile(
    profile_data: JobSeekerProfileUpdate,
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_profile(
        current_user,
        database,
    )

    for field, value in profile_data.model_dump().items():
        setattr(profile, field, value)

    database.commit()
    database.refresh(profile)

    return profile
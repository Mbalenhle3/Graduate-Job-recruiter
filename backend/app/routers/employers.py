from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import EmployerProfile, User
from ..schemas import (
    EmployerProfileResponse,
    EmployerProfileUpdate,
)


router = APIRouter(
    prefix="/api/employers",
    tags=["Employer Profile"],
)


def get_or_create_employer_profile(
    current_user: User,
    database: Session,
) -> EmployerProfile:
    profile = database.scalar(
        select(EmployerProfile).where(
            EmployerProfile.user_id == current_user.id
        )
    )

    if profile:
        return profile

    profile = EmployerProfile(
        user_id=current_user.id,
        contact_email=current_user.email,
    )

    database.add(profile)
    database.commit()
    database.refresh(profile)

    return profile


@router.get(
    "/me/profile",
    response_model=EmployerProfileResponse,
)
def get_my_employer_profile(
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    return get_or_create_employer_profile(
        current_user,
        database,
    )


@router.put(
    "/me/profile",
    response_model=EmployerProfileResponse,
)
def update_my_employer_profile(
    profile_data: EmployerProfileUpdate,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_employer_profile(
        current_user,
        database,
    )

    updated_fields = profile_data.model_dump(
        exclude_unset=True
    )

    for field, value in updated_fields.items():
        setattr(profile, field, value)

    database.commit()
    database.refresh(profile)

    return profile
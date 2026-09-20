from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import (
    EmployerProfile,
    Opportunity,
    User,
)
from ..schemas import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpdate,
)


router = APIRouter(
    prefix="/api/employers/me/opportunities",
    tags=["Employer Opportunities"],
)


def get_employer_profile(
    current_user: User,
    database: Session,
) -> EmployerProfile:
    profile = database.scalar(
        select(EmployerProfile).where(
            EmployerProfile.user_id == current_user.id
        )
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Complete your organisation profile "
                "before managing opportunities"
            ),
        )

    return profile


def get_owned_opportunity(
    opportunity_id: int,
    employer_profile: EmployerProfile,
    database: Session,
) -> Opportunity:
    opportunity = database.scalar(
        select(Opportunity).where(
            Opportunity.id == opportunity_id,
            Opportunity.employer_profile_id
            == employer_profile.id,
        )
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The opportunity was not found",
        )

    return opportunity


@router.get(
    "",
    response_model=list[OpportunityResponse],
)
def list_my_opportunities(
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    return database.scalars(
        select(Opportunity)
        .where(
            Opportunity.employer_profile_id
            == profile.id
        )
        .order_by(
            Opportunity.created_at.desc()
        )
    ).all()


@router.post(
    "",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_opportunity(
    opportunity_data: OpportunityCreate,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    if not profile.organisation_name:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Complete your organisation profile "
                "before creating an opportunity"
            ),
        )

    opportunity = Opportunity(
        employer_profile_id=profile.id,
        **opportunity_data.model_dump(),
        status="draft",
    )

    database.add(opportunity)
    database.commit()
    database.refresh(opportunity)

    return opportunity


@router.get(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def get_my_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    return get_owned_opportunity(
        opportunity_id,
        profile,
        database,
    )


@router.put(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def update_my_opportunity(
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    opportunity = get_owned_opportunity(
        opportunity_id,
        profile,
        database,
    )

    if opportunity.status not in [
        "draft",
        "rejected",
    ]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Only draft or rejected opportunities "
                "can be edited"
            ),
        )

    updated_fields = opportunity_data.model_dump(
        exclude_unset=True
    )

    for field, value in updated_fields.items():
        setattr(opportunity, field, value)

    if opportunity.status == "rejected":
        opportunity.status = "draft"
        opportunity.rejection_reason = None

    database.commit()
    database.refresh(opportunity)

    return opportunity


@router.post(
    "/{opportunity_id}/submit",
    response_model=OpportunityResponse,
)
def submit_opportunity_for_review(
    opportunity_id: int,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    if profile.verification_status != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your organisation must be approved "
                "before submitting opportunities"
            ),
        )

    opportunity = get_owned_opportunity(
        opportunity_id,
        profile,
        database,
    )

    if opportunity.status == "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This opportunity is already awaiting "
                "administrator review"
            ),
        )

    if opportunity.status == "published":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This opportunity is already published",
        )

    if opportunity.status == "closed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A closed opportunity cannot be submitted",
        )

    if opportunity.closing_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=(
                "Update the closing date before submitting "
                "this opportunity"
            ),
        )

    opportunity.status = "pending"
    opportunity.rejection_reason = None

    database.commit()
    database.refresh(opportunity)

    return opportunity


@router.patch(
    "/{opportunity_id}/close",
    response_model=OpportunityResponse,
)
def close_my_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_employer_profile(
        current_user,
        database,
    )

    opportunity = get_owned_opportunity(
        opportunity_id,
        profile,
        database,
    )

    if opportunity.status != "published":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Only a published opportunity can be closed"
            ),
        )

    opportunity.status = "closed"

    database.commit()
    database.refresh(opportunity)

    return opportunity
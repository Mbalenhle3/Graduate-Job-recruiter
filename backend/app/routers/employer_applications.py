from pathlib import Path
from typing import Literal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import (
    EmployerProfile,
    JobApplication,
    JobSeekerProfile,
    Opportunity,
    User,
)
from ..notification_service import create_notification
from ..schemas import (
    ApplicationStatusUpdate,
    EmployerApplicantResponse,
)


router = APIRouter(
    prefix="/api/employers",
    tags=["Employer Applicants"],
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def get_employer_profile(
    current_user: User,
    database: Session,
) -> EmployerProfile:
    profile = database.scalar(
        select(EmployerProfile).where(
            EmployerProfile.user_id
            == current_user.id
        )
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Complete your organisation profile "
                "before managing applicants"
            ),
        )

    return profile


def get_employer_application_result(
    application_id: int,
    employer_profile: EmployerProfile,
    database: Session,
):
    result = database.execute(
        select(
            JobApplication,
            Opportunity,
            JobSeekerProfile,
            User,
        )
        .join(
            Opportunity,
            JobApplication.opportunity_id
            == Opportunity.id,
        )
        .join(
            JobSeekerProfile,
            JobApplication.job_seeker_profile_id
            == JobSeekerProfile.user_id,
        )
        .join(
            User,
            JobSeekerProfile.user_id == User.id,
        )
        .where(
            JobApplication.id == application_id,
            Opportunity.employer_profile_id
            == employer_profile.id,
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The application was not found",
        )

    return result


def employer_applicant_response(
    application: JobApplication,
    opportunity: Opportunity,
    profile: JobSeekerProfile,
    applicant: User,
) -> dict:
    return {
        "id": application.id,
        "opportunity_id": opportunity.id,
        "opportunity_title": opportunity.title,
        "job_seeker_profile_id": profile.user_id,
        "first_name": applicant.first_name,
        "last_name": applicant.last_name,
        "email": applicant.email,
        "qualification": profile.qualification,
        "institution": profile.institution,
        "resume_name": application.resume_name,
        "cover_letter": application.cover_letter,
        "status": application.status,
        "employer_notes": (
            application.employer_notes
        ),
        "submitted_at": application.submitted_at,
        "updated_at": application.updated_at,
    }


# =========================================================
# LIST EMPLOYER APPLICANTS
# =========================================================

@router.get(
    "/me/applicants",
    response_model=list[EmployerApplicantResponse],
)
def list_my_applicants(
    opportunity_id: int | None = Query(
        default=None
    ),
    application_status: Literal[
        "submitted",
        "under_review",
        "shortlisted",
        "rejected",
        "withdrawn",
        "hired",
    ] | None = Query(
        default=None,
        alias="status",
    ),
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    employer_profile = get_employer_profile(
        current_user,
        database,
    )

    query = (
        select(
            JobApplication,
            Opportunity,
            JobSeekerProfile,
            User,
        )
        .join(
            Opportunity,
            JobApplication.opportunity_id
            == Opportunity.id,
        )
        .join(
            JobSeekerProfile,
            JobApplication.job_seeker_profile_id
            == JobSeekerProfile.user_id,
        )
        .join(
            User,
            JobSeekerProfile.user_id == User.id,
        )
        .where(
            Opportunity.employer_profile_id
            == employer_profile.id
        )
        .order_by(
            JobApplication.submitted_at.desc()
        )
    )

    if opportunity_id is not None:
        query = query.where(
            Opportunity.id == opportunity_id
        )

    if application_status:
        query = query.where(
            JobApplication.status
            == application_status
        )

    results = database.execute(query).all()

    return [
        employer_applicant_response(
            application,
            opportunity,
            profile,
            applicant,
        )
        for (
            application,
            opportunity,
            profile,
            applicant,
        ) in results
    ]


# =========================================================
# VIEW ONE APPLICANT
# =========================================================

@router.get(
    "/me/applicants/{application_id}",
    response_model=EmployerApplicantResponse,
)
def get_my_applicant(
    application_id: int,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    employer_profile = get_employer_profile(
        current_user,
        database,
    )

    (
        application,
        opportunity,
        profile,
        applicant,
    ) = get_employer_application_result(
        application_id,
        employer_profile,
        database,
    )

    return employer_applicant_response(
        application,
        opportunity,
        profile,
        applicant,
    )


# =========================================================
# DOWNLOAD APPLICANT CV
# =========================================================

@router.get(
    "/me/applicants/{application_id}/resume",
)
def download_applicant_resume(
    application_id: int,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    employer_profile = get_employer_profile(
        current_user,
        database,
    )

    (
        application,
        _opportunity,
        _profile,
        _applicant,
    ) = get_employer_application_result(
        application_id,
        employer_profile,
        database,
    )

    resume_path = Path(
        application.resume_path
    )

    if not resume_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The applicant CV could not "
                "be found"
            ),
        )

    return FileResponse(
        path=resume_path,
        media_type="application/pdf",
        filename=application.resume_name,
    )


# =========================================================
# UPDATE APPLICATION STATUS
# =========================================================

@router.patch(
    "/me/applicants/{application_id}/status",
    response_model=EmployerApplicantResponse,
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    employer_profile = get_employer_profile(
        current_user,
        database,
    )

    (
        application,
        opportunity,
        profile,
        applicant,
    ) = get_employer_application_result(
        application_id,
        employer_profile,
        database,
    )

    if application.status == "withdrawn":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A withdrawn application "
                "cannot be updated"
            ),
        )

    if application.status == "hired":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A hired application "
                "cannot be changed"
            ),
        )

    if application.status == "rejected":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A rejected application "
                "cannot be changed"
            ),
        )

    if application.status == status_data.status:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The application already has "
                f'the status "{status_data.status}"'
            ),
        )

    if (
        status_data.status == "rejected"
        and (
            not status_data.employer_notes
            or not status_data.employer_notes.strip()
        )
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            detail=(
                "Please provide a reason when "
                "rejecting an application"
            ),
        )

    application.status = status_data.status

    if status_data.employer_notes is not None:
        application.employer_notes = (
            status_data.employer_notes.strip()
            or None
        )

    status_messages = {
        "under_review": (
            "Your application is now being reviewed."
        ),
        "shortlisted": (
            "Congratulations! You have been "
            "shortlisted for this opportunity."
        ),
        "rejected": (
            "Your application was unsuccessful."
        ),
        "hired": (
            "Congratulations! Your application "
            "has been marked as hired."
        ),
    }

    notification_titles = {
        "under_review": (
            "Application under review"
        ),
        "shortlisted": (
            "Application shortlisted"
        ),
        "rejected": (
            "Application unsuccessful"
        ),
        "hired": (
            "Application successful"
        ),
    }

    notification_message = (
        status_messages[application.status]
    )

    if (
        application.status == "rejected"
        and application.employer_notes
    ):
        notification_message += (
            f" Reason: {application.employer_notes}"
        )

    create_notification(
        database=database,
        user_id=applicant.id,
        notification_type=(
            f"APPLICATION_"
            f"{application.status.upper()}"
        ),
        title=(
            notification_titles[
                application.status
            ]
        ),
        message=(
            f'Your application for '
            f'"{opportunity.title}" was updated. '
            f"{notification_message}"
        ),
        related_type="job_application",
        related_id=application.id,
    )

    database.commit()
    database.refresh(application)

    return employer_applicant_response(
        application,
        opportunity,
        profile,
        applicant,
    )
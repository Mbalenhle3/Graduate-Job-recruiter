from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import (
    EmployerProfile,
    JobApplication,
    JobSeekerProfile,
    Opportunity,
    SavedOpportunity,
    User,
)
from ..schemas import (
    EmployerDashboardResponse,
    JobSeekerDashboardResponse,
)


router = APIRouter(
    tags=["Dashboards"],
)


def count_records(
    database: Session,
    model,
    *conditions,
) -> int:
    query = select(func.count()).select_from(model)

    if conditions:
        query = query.where(*conditions)

    return database.scalar(query) or 0


def calculate_profile_strength(
    profile: JobSeekerProfile | None,
) -> int:
    if not profile:
        return 0

    profile_fields = [
        "phone",
        "city",
        "province",
        "qualification",
        "institution",
        "study_status",
        "graduation_year",
        "professional_summary",
        "preferred_roles",
    ]

    completed_fields = 0

    for field in profile_fields:
        value = getattr(profile, field, None)

        if value is not None and value != "" and value != []:
            completed_fields += 1

    percentage = round(
        completed_fields
        / len(profile_fields)
        * 100
    )

    return percentage


# =========================================================
# JOB-SEEKER DASHBOARD
# =========================================================

@router.get(
    "/api/job-seekers/me/dashboard",
    response_model=JobSeekerDashboardResponse,
)
def get_job_seeker_dashboard(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = database.scalar(
        select(JobSeekerProfile).where(
            JobSeekerProfile.user_id
            == current_user.id
        )
    )

    profile_id = current_user.id

    total_applications = count_records(
        database,
        JobApplication,
        JobApplication.job_seeker_profile_id
        == profile_id,
    )

    active_applications = count_records(
        database,
        JobApplication,
        JobApplication.job_seeker_profile_id
        == profile_id,
        JobApplication.status.in_(
            [
                "submitted",
                "under_review",
                "shortlisted",
            ]
        ),
    )

    shortlisted_applications = count_records(
        database,
        JobApplication,
        JobApplication.job_seeker_profile_id
        == profile_id,
        JobApplication.status == "shortlisted",
    )

    rejected_applications = count_records(
        database,
        JobApplication,
        JobApplication.job_seeker_profile_id
        == profile_id,
        JobApplication.status == "rejected",
    )

    saved_opportunities = count_records(
        database,
        SavedOpportunity,
        SavedOpportunity.job_seeker_profile_id
        == profile_id,
    )

    available_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.status == "published",
        Opportunity.closing_date >= date.today(),
    )

    return {
        "profile_strength": (
            calculate_profile_strength(profile)
        ),
        "total_applications": total_applications,
        "active_applications": active_applications,
        "shortlisted_applications": (
            shortlisted_applications
        ),
        "rejected_applications": (
            rejected_applications
        ),
        "saved_opportunities": saved_opportunities,
        "available_opportunities": (
            available_opportunities
        ),
    }


# =========================================================
# EMPLOYER DASHBOARD
# =========================================================

@router.get(
    "/api/employers/me/dashboard",
    response_model=EmployerDashboardResponse,
)
def get_employer_dashboard(
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    employer_profile = database.scalar(
        select(EmployerProfile).where(
            EmployerProfile.user_id
            == current_user.id
        )
    )

    if not employer_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Complete your organisation profile "
                "before viewing the dashboard"
            ),
        )

    employer_profile_id = employer_profile.id

    total_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
    )

    draft_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
        Opportunity.status == "draft",
    )

    pending_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
        Opportunity.status == "pending",
    )

    active_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
        Opportunity.status == "published",
        Opportunity.closing_date >= date.today(),
    )

    rejected_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
        Opportunity.status == "rejected",
    )

    closed_opportunities = count_records(
        database,
        Opportunity,
        Opportunity.employer_profile_id
        == employer_profile_id,
        Opportunity.status == "closed",
    )

    def count_employer_applications(
        *conditions,
    ) -> int:
        query = (
            select(func.count())
            .select_from(JobApplication)
            .join(
                Opportunity,
                JobApplication.opportunity_id
                == Opportunity.id,
            )
            .where(
                Opportunity.employer_profile_id
                == employer_profile_id,
                *conditions,
            )
        )

        return database.scalar(query) or 0

    total_applicants = count_employer_applications()

    under_review_applicants = (
        count_employer_applications(
            JobApplication.status
            == "under_review"
        )
    )

    shortlisted_applicants = (
        count_employer_applications(
            JobApplication.status
            == "shortlisted"
        )
    )

    hired_applicants = (
        count_employer_applications(
            JobApplication.status == "hired"
        )
    )

    return {
        "verification_status": (
            employer_profile.verification_status
        ),
        "total_opportunities": total_opportunities,
        "draft_opportunities": draft_opportunities,
        "pending_opportunities": (
            pending_opportunities
        ),
        "active_opportunities": (
            active_opportunities
        ),
        "rejected_opportunities": (
            rejected_opportunities
        ),
        "closed_opportunities": (
            closed_opportunities
        ),
        "total_applicants": total_applicants,
        "under_review_applicants": (
            under_review_applicants
        ),
        "shortlisted_applicants": (
            shortlisted_applicants
        ),
        "hired_applicants": hired_applicants,
    }
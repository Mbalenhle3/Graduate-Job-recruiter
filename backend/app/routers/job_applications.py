from datetime import date
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..config import settings
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
from ..notification_service import create_notification
from ..schemas import (
    JobApplicationResponse,
    JobSeekerApplicationResponse,
    MessageResponse,
    PublicOpportunityResponse,
    SavedOpportunityResponse,
)


router = APIRouter(
    tags=["Job Applications"],
)


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def get_job_seeker_profile(
    current_user: User,
    database: Session,
) -> JobSeekerProfile:
    profile = database.scalar(
        select(JobSeekerProfile).where(
            JobSeekerProfile.user_id
            == current_user.id
        )
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Complete your job-seeker profile "
                "before using this feature"
            ),
        )

    return profile


def public_opportunity_response(
    opportunity: Opportunity,
    employer_profile: EmployerProfile,
) -> dict:
    return {
        "id": opportunity.id,
        "employer_profile_id": (
            opportunity.employer_profile_id
        ),
        "organisation_name": (
            employer_profile.organisation_name
        ),
        "title": opportunity.title,
        "description": opportunity.description,
        "requirements": opportunity.requirements,
        "qualification": opportunity.qualification,
        "location": opportunity.location,
        "province": opportunity.province,
        "work_mode": opportunity.work_mode,
        "opportunity_type": (
            opportunity.opportunity_type
        ),
        "required_experience_years": (
            opportunity.required_experience_years
        ),
        "closing_date": opportunity.closing_date,
        "status": opportunity.status,
        "created_at": opportunity.created_at,
        "updated_at": opportunity.updated_at,
    }


def job_seeker_application_response(
    application: JobApplication,
    opportunity: Opportunity,
    employer_profile: EmployerProfile,
) -> dict:
    return {
        "id": application.id,
        "opportunity_id": opportunity.id,
        "opportunity_title": opportunity.title,
        "organisation_name": (
            employer_profile.organisation_name
        ),
        "location": opportunity.location,
        "opportunity_type": (
            opportunity.opportunity_type
        ),
        "status": application.status,
        "resume_name": application.resume_name,
        "submitted_at": application.submitted_at,
        "updated_at": application.updated_at,
    }


def saved_opportunity_response(
    saved: SavedOpportunity,
    opportunity: Opportunity,
    employer_profile: EmployerProfile,
) -> dict:
    return {
        "id": saved.id,
        "opportunity_id": opportunity.id,
        "organisation_name": (
            employer_profile.organisation_name
        ),
        "title": opportunity.title,
        "location": opportunity.location,
        "province": opportunity.province,
        "work_mode": opportunity.work_mode,
        "opportunity_type": (
            opportunity.opportunity_type
        ),
        "closing_date": opportunity.closing_date,
        "saved_at": saved.saved_at,
    }


# =========================================================
# PUBLIC OPPORTUNITIES
# =========================================================

@router.get(
    "/api/opportunities",
    response_model=list[PublicOpportunityResponse],
)
def list_published_opportunities(
    province: str | None = Query(default=None),
    opportunity_type: str | None = Query(
        default=None
    ),
    work_mode: str | None = Query(default=None),
    database: Session = Depends(get_database),
):
    query = (
        select(Opportunity, EmployerProfile)
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            Opportunity.status == "published",
            Opportunity.closing_date
            >= date.today(),
        )
        .order_by(
            Opportunity.created_at.desc()
        )
    )

    if province:
        query = query.where(
            Opportunity.province == province
        )

    if opportunity_type:
        query = query.where(
            Opportunity.opportunity_type
            == opportunity_type
        )

    if work_mode:
        query = query.where(
            Opportunity.work_mode == work_mode
        )

    results = database.execute(query).all()

    return [
        public_opportunity_response(
            opportunity,
            employer_profile,
        )
        for opportunity, employer_profile in results
    ]


@router.get(
    "/api/opportunities/{opportunity_id}",
    response_model=PublicOpportunityResponse,
)
def get_published_opportunity(
    opportunity_id: int,
    database: Session = Depends(get_database),
):
    result = database.execute(
        select(Opportunity, EmployerProfile)
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            Opportunity.id == opportunity_id,
            Opportunity.status == "published",
            Opportunity.closing_date
            >= date.today(),
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The opportunity was not found "
                "or has already closed"
            ),
        )

    opportunity, employer_profile = result

    return public_opportunity_response(
        opportunity,
        employer_profile,
    )


# =========================================================
# SUBMIT APPLICATION
# =========================================================

@router.post(
    "/api/job-seekers/opportunities/"
    "{opportunity_id}/apply",
    response_model=JobApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_opportunity(
    opportunity_id: int,
    cover_letter: str | None = Form(default=None),
    resume: UploadFile = File(...),
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    opportunity = database.get(
        Opportunity,
        opportunity_id,
    )

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The opportunity was not found",
        )

    if opportunity.status != "published":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This opportunity is not available "
                "for applications"
            ),
        )

    if opportunity.closing_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The closing date for this "
                "opportunity has passed"
            ),
        )

    employer_profile = database.get(
        EmployerProfile,
        opportunity.employer_profile_id,
    )

    if not employer_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The employer profile "
                "could not be found"
            ),
        )

    existing_application = database.scalar(
        select(JobApplication).where(
            JobApplication.job_seeker_profile_id
            == profile.user_id,
            JobApplication.opportunity_id
            == opportunity.id,
        )
    )

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "You have already applied for "
                "this opportunity"
            ),
        )

    if (
        cover_letter
        and len(cover_letter.strip()) > 5000
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "The cover letter must not exceed "
                "5000 characters"
            ),
        )

    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CV must be a PDF file",
        )

    resume_content = resume.file.read(
        settings.max_resume_bytes + 1
    )

    if not resume_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CV is empty",
        )

    if (
        len(resume_content)
        > settings.max_resume_bytes
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            ),
            detail="The CV must not exceed 5 MB",
        )

    if not resume_content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "The uploaded file is not "
                "a valid PDF"
            ),
        )

    upload_directory = (
        Path(settings.upload_directory)
        / "resumes"
    )

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_filename = f"{uuid4().hex}.pdf"

    resume_path = (
        upload_directory / stored_filename
    )

    safe_original_filename = Path(
        resume.filename or "resume.pdf"
    ).name

    resume_path.write_bytes(resume_content)

    application = JobApplication(
        job_seeker_profile_id=profile.user_id,
        opportunity_id=opportunity.id,
        cover_letter=(
            cover_letter.strip()
            if cover_letter
            and cover_letter.strip()
            else None
        ),
        resume_name=safe_original_filename,
        resume_path=str(resume_path),
        status="submitted",
    )

    try:
        database.add(application)

        # Flush creates the application ID without
        # committing the transaction.
        database.flush()

        create_notification(
            database=database,
            user_id=employer_profile.user_id,
            notification_type=(
                "APPLICATION_RECEIVED"
            ),
            title="New job application",
            message=(
                f"{current_user.first_name} "
                f"{current_user.last_name} applied "
                f'for "{opportunity.title}".'
            ),
            related_type="job_application",
            related_id=application.id,
        )

        create_notification(
            database=database,
            user_id=current_user.id,
            notification_type=(
                "APPLICATION_SUBMITTED"
            ),
            title="Application submitted",
            message=(
                f'Your application for '
                f'"{opportunity.title}" was '
                "submitted successfully."
            ),
            related_type="job_application",
            related_id=application.id,
        )

        database.commit()
        database.refresh(application)

    except IntegrityError as error:
        database.rollback()

        if resume_path.is_file():
            resume_path.unlink()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "You have already applied for "
                "this opportunity"
            ),
        ) from error

    except Exception:
        database.rollback()

        if resume_path.is_file():
            resume_path.unlink()

        raise

    return application


# =========================================================
# JOB-SEEKER APPLICATIONS
# =========================================================

@router.get(
    "/api/job-seekers/me/applications",
    response_model=list[
        JobSeekerApplicationResponse
    ],
)
def list_my_applications(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    results = database.execute(
        select(
            JobApplication,
            Opportunity,
            EmployerProfile,
        )
        .join(
            Opportunity,
            JobApplication.opportunity_id
            == Opportunity.id,
        )
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            JobApplication.job_seeker_profile_id
            == profile.user_id
        )
        .order_by(
            JobApplication.submitted_at.desc()
        )
    ).all()

    return [
        job_seeker_application_response(
            application,
            opportunity,
            employer_profile,
        )
        for (
            application,
            opportunity,
            employer_profile,
        ) in results
    ]


@router.get(
    "/api/job-seekers/me/applications/"
    "{application_id}",
    response_model=JobSeekerApplicationResponse,
)
def get_my_application(
    application_id: int,
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    result = database.execute(
        select(
            JobApplication,
            Opportunity,
            EmployerProfile,
        )
        .join(
            Opportunity,
            JobApplication.opportunity_id
            == Opportunity.id,
        )
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            JobApplication.id == application_id,
            JobApplication.job_seeker_profile_id
            == profile.user_id,
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The application was not found",
        )

    application, opportunity, employer_profile = (
        result
    )

    return job_seeker_application_response(
        application,
        opportunity,
        employer_profile,
    )


@router.patch(
    "/api/job-seekers/me/applications/"
    "{application_id}/withdraw",
    response_model=JobApplicationResponse,
)
def withdraw_my_application(
    application_id: int,
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    result = database.execute(
        select(
            JobApplication,
            Opportunity,
            EmployerProfile,
        )
        .join(
            Opportunity,
            JobApplication.opportunity_id
            == Opportunity.id,
        )
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            JobApplication.id == application_id,
            JobApplication.job_seeker_profile_id
            == profile.user_id,
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The application was not found",
        )

    application, opportunity, employer_profile = (
        result
    )

    if application.status in {
        "withdrawn",
        "rejected",
        "hired",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This application can no longer "
                "be withdrawn"
            ),
        )

    application.status = "withdrawn"

    create_notification(
        database=database,
        user_id=employer_profile.user_id,
        notification_type=(
            "APPLICATION_WITHDRAWN"
        ),
        title="Application withdrawn",
        message=(
            f"{current_user.first_name} "
            f"{current_user.last_name} withdrew "
            f'the application for '
            f'"{opportunity.title}".'
        ),
        related_type="job_application",
        related_id=application.id,
    )

    database.commit()
    database.refresh(application)

    return application


# =========================================================
# SAVED OPPORTUNITIES
# =========================================================

@router.get(
    "/api/job-seekers/me/saved-opportunities",
    response_model=list[
        SavedOpportunityResponse
    ],
)
def list_my_saved_opportunities(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    results = database.execute(
        select(
            SavedOpportunity,
            Opportunity,
            EmployerProfile,
        )
        .join(
            Opportunity,
            SavedOpportunity.opportunity_id
            == Opportunity.id,
        )
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            SavedOpportunity.job_seeker_profile_id
            == profile.user_id
        )
        .order_by(
            SavedOpportunity.saved_at.desc()
        )
    ).all()

    return [
        saved_opportunity_response(
            saved,
            opportunity,
            employer_profile,
        )
        for (
            saved,
            opportunity,
            employer_profile,
        ) in results
    ]


@router.post(
    "/api/job-seekers/opportunities/"
    "{opportunity_id}/save",
    response_model=SavedOpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def save_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    result = database.execute(
        select(Opportunity, EmployerProfile)
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .where(
            Opportunity.id == opportunity_id,
            Opportunity.status == "published",
            Opportunity.closing_date
            >= date.today(),
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The opportunity is unavailable "
                "or has already closed"
            ),
        )

    opportunity, employer_profile = result

    existing_saved = database.scalar(
        select(SavedOpportunity).where(
            SavedOpportunity.job_seeker_profile_id
            == profile.user_id,
            SavedOpportunity.opportunity_id
            == opportunity.id,
        )
    )

    if existing_saved:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "You have already saved "
                "this opportunity"
            ),
        )

    saved = SavedOpportunity(
        job_seeker_profile_id=profile.user_id,
        opportunity_id=opportunity.id,
    )

    try:
        database.add(saved)
        database.commit()
        database.refresh(saved)

    except IntegrityError as error:
        database.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "You have already saved "
                "this opportunity"
            ),
        ) from error

    return saved_opportunity_response(
        saved,
        opportunity,
        employer_profile,
    )


@router.delete(
    "/api/job-seekers/opportunities/"
    "{opportunity_id}/save",
    response_model=MessageResponse,
)
def remove_saved_opportunity(
    opportunity_id: int,
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_job_seeker_profile(
        current_user,
        database,
    )

    saved = database.scalar(
        select(SavedOpportunity).where(
            SavedOpportunity.job_seeker_profile_id
            == profile.user_id,
            SavedOpportunity.opportunity_id
            == opportunity_id,
        )
    )

    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "This opportunity is not "
                "in your saved list"
            ),
        )

    database.delete(saved)
    database.commit()

    return {
        "message": (
            "Opportunity removed from saved jobs"
        )
    }
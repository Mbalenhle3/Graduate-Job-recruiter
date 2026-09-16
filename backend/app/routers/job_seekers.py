from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_database
from ..dependencies import require_roles
from ..models import JobSeekerProfile, User
from ..schemas import (
    JobSeekerProfileResponse,
    JobSeekerProfileUpdate,
    MessageResponse,
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
        full_name=(
            f"{user.first_name} {user.last_name}"
        ).strip(),
    )

    database.add(profile)
    database.commit()
    database.refresh(profile)

    return profile


def validate_cv(cv: UploadFile) -> bytes:
    if cv.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CV must be a PDF file",
        )

    cv_content = cv.file.read(
        settings.max_resume_bytes + 1
    )

    if not cv_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CV is empty",
        )

    if len(cv_content) > settings.max_resume_bytes:
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            ),
            detail="The CV must not exceed 5 MB",
        )

    if not cv_content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is not a valid PDF",
        )

    return cv_content


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

    updated_fields = profile_data.model_dump(
        exclude_unset=True
    )

    for field, value in updated_fields.items():
        setattr(profile, field, value)

    database.commit()
    database.refresh(profile)

    return profile


@router.post(
    "/me/cv",
    response_model=JobSeekerProfileResponse,
)
def upload_my_cv(
    cv: UploadFile = File(...),
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_profile(
        current_user,
        database,
    )

    cv_content = validate_cv(cv)

    upload_directory = (
        Path(settings.upload_directory)
        / "job_seeker_cvs"
    )

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_filename = f"{uuid4().hex}.pdf"
    new_cv_path = upload_directory / stored_filename

    original_filename = Path(
        cv.filename or "curriculum-vitae.pdf"
    ).name

    old_cv_path = (
        Path(profile.cv_path)
        if profile.cv_path
        else None
    )

    try:
        new_cv_path.write_bytes(cv_content)

        profile.cv_name = original_filename
        profile.cv_path = str(new_cv_path)

        database.commit()
        database.refresh(profile)

    except Exception:
        database.rollback()

        if new_cv_path.is_file():
            new_cv_path.unlink()

        raise

    if (
        old_cv_path
        and old_cv_path != new_cv_path
        and old_cv_path.is_file()
    ):
        old_cv_path.unlink()

    return profile


@router.get(
    "/me/cv",
)
def download_my_cv(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_profile(
        current_user,
        database,
    )

    if not profile.cv_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have not uploaded a CV",
        )

    cv_path = Path(profile.cv_path)

    if not cv_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The uploaded CV could not be found",
        )

    return FileResponse(
        path=cv_path,
        media_type="application/pdf",
        filename=(
            profile.cv_name
            or "curriculum-vitae.pdf"
        ),
    )


@router.delete(
    "/me/cv",
    response_model=MessageResponse,
)
def delete_my_cv(
    current_user: User = Depends(
        require_roles("job_seeker")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_profile(
        current_user,
        database,
    )

    if not profile.cv_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have not uploaded a CV",
        )

    cv_path = Path(profile.cv_path)

    profile.cv_name = None
    profile.cv_path = None

    database.commit()

    if cv_path.is_file():
        cv_path.unlink()

    return {
        "message": "CV deleted successfully",
    }
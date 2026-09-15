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
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
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


ALLOWED_DOCUMENT_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
}


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

    contact_name = " ".join(
        name
        for name in [
            current_user.first_name,
            current_user.last_name,
        ]
        if name
    )

    profile = EmployerProfile(
        user_id=current_user.id,
        contact_name=contact_name or None,
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

    profile_changed = any(
        getattr(profile, field) != value
        for field, value in updated_fields.items()
    )

    for field, value in updated_fields.items():
        setattr(profile, field, value)

    # An organisation must submit verification again
    # if it changes its details.
    if (
        profile_changed
        and profile.verification_status
        != "not_submitted"
    ):
        profile.verification_status = "not_submitted"
        profile.verification_rejection_reason = None

    database.commit()
    database.refresh(profile)

    return profile


@router.post(
    "/me/verification-document",
    response_model=EmployerProfileResponse,
)
async def upload_verification_document(
    document: UploadFile = File(...),
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    if document.content_type not in ALLOWED_DOCUMENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                "Only PDF, JPG and PNG documents "
                "are accepted"
            ),
        )

    contents = await document.read(
        settings.max_verification_document_bytes + 1
    )

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The selected document is empty",
        )

    if (
        len(contents)
        > settings.max_verification_document_bytes
    ):
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=(
                "The verification document must not "
                "be larger than 5 MB"
            ),
        )

    extension = ALLOWED_DOCUMENT_TYPES[
        document.content_type
    ]

    upload_directory = (
        Path(settings.upload_directory)
        / "employer_verification"
    )

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_filename = (
        f"employer_{current_user.id}_"
        f"{uuid4().hex}{extension}"
    )

    document_path = (
        upload_directory / stored_filename
    ).resolve()

    try:
        document_path.write_bytes(contents)
    except OSError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The document could not be stored",
        ) from error
    finally:
        await document.close()

    profile = get_or_create_employer_profile(
        current_user,
        database,
    )

    profile.verification_document_name = (
        document.filename or "Verification document"
    )

    profile.verification_document_path = str(
        document_path
    )

    # Uploading a new document requires a new submission.
    profile.verification_status = "not_submitted"
    profile.verification_rejection_reason = None

    database.commit()
    database.refresh(profile)

    return profile


@router.post(
    "/me/verification-request",
    response_model=EmployerProfileResponse,
)
def submit_verification_request(
    current_user: User = Depends(
        require_roles("employer")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_employer_profile(
        current_user,
        database,
    )

    required_fields = {
        "Contact person": profile.contact_name,
        "Organisation name": profile.organisation_name,
        "Registration number":
            profile.registration_number,
        "Contact email": profile.contact_email,
        "Phone number": profile.phone,
        "Industry": profile.industry,
        "City": profile.city,
        "Province": profile.province,
        "Organisation description":
            profile.description,
        "Verification document":
            profile.verification_document_path,
    }

    missing_fields = [
        label
        for label, value in required_fields.items()
        if not value or not str(value).strip()
    ]

    if missing_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=(
                "Complete the following fields before "
                "submitting verification: "
                + ", ".join(missing_fields)
            ),
        )

    if profile.verification_status == "approved":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This organisation is already approved",
        )

    if profile.verification_status == "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This organisation is already awaiting "
                "administrator review"
            ),
        )

    profile.verification_status = "pending"
    profile.verification_rejection_reason = None

    database.commit()
    database.refresh(profile)

    return profile
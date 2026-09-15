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
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import require_roles
from ..models import (
    AdminActivity,
    AdminProfile,
    EmployerProfile,
    Opportunity,
    User,
)
from ..notification_service import create_notification
from ..schemas import (
    AdminActivityResponse,
    AdminDashboardResponse,
    AdminEmployerResponse,
    AdminOpportunityResponse,
    AdminProfileResponse,
    AdminProfileUpdate,
    AdminUserResponse,
    EmployerVerificationDecision,
    OpportunityReviewDecision,
    UserAccountStatusUpdate,
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Administrator"],
)


# =========================================================
# COMMON HELPERS
# =========================================================

def count_records(
    database: Session,
    model,
    *conditions,
) -> int:
    query = select(func.count()).select_from(model)

    if conditions:
        query = query.where(*conditions)

    return database.scalar(query) or 0


# =========================================================
# ADMINISTRATOR PROFILE HELPERS
# =========================================================

def get_or_create_admin_profile(
    current_admin: User,
    database: Session,
) -> AdminProfile:
    profile = database.scalar(
        select(AdminProfile).where(
            AdminProfile.user_id
            == current_admin.id
        )
    )

    if profile:
        return profile

    profile = AdminProfile(
        user_id=current_admin.id,
    )

    database.add(profile)
    database.commit()
    database.refresh(profile)

    return profile


def admin_profile_response(
    admin: User,
    profile: AdminProfile,
) -> dict:
    return {
        "id": profile.id,
        "user_id": admin.id,
        "first_name": admin.first_name,
        "last_name": admin.last_name,
        "email": admin.email,
        "is_active": admin.is_active,
        "phone": profile.phone,
        "job_title": profile.job_title,
        "department": profile.department,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


# =========================================================
# ADMINISTRATOR PROFILE ENDPOINTS
# =========================================================

@router.get(
    "/me/profile",
    response_model=AdminProfileResponse,
)
def get_my_admin_profile(
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_admin_profile(
        current_admin,
        database,
    )

    return admin_profile_response(
        current_admin,
        profile,
    )


@router.put(
    "/me/profile",
    response_model=AdminProfileResponse,
)
def update_my_admin_profile(
    profile_data: AdminProfileUpdate,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    profile = get_or_create_admin_profile(
        current_admin,
        database,
    )

    updated_fields = profile_data.model_dump(
        exclude_unset=True
    )

    changed_fields = []

    account_fields = {
        "first_name",
        "last_name",
    }

    for field, value in updated_fields.items():
        target = (
            current_admin
            if field in account_fields
            else profile
        )

        if getattr(target, field) != value:
            setattr(target, field, value)
            changed_fields.append(field)

    if changed_fields:
        activity = AdminActivity(
            admin_user_id=current_admin.id,
            action="ADMIN_PROFILE_UPDATED",
            target_type="admin_profile",
            target_id=profile.id,
            description=(
                "Administrator updated profile fields: "
                + ", ".join(changed_fields)
            ),
        )

        database.add(activity)
        database.commit()
        database.refresh(profile)

    return admin_profile_response(
        current_admin,
        profile,
    )


# =========================================================
# EMPLOYER VERIFICATION HELPERS
# =========================================================

def admin_employer_response(
    profile: EmployerProfile,
    employer: User,
) -> dict:
    return {
        "id": profile.id,
        "user_id": employer.id,
        "first_name": employer.first_name,
        "last_name": employer.last_name,
        "account_email": employer.email,
        "is_active": employer.is_active,
        "contact_name": profile.contact_name,
        "organisation_name": (
            profile.organisation_name
        ),
        "registration_number": (
            profile.registration_number
        ),
        "contact_email": profile.contact_email,
        "phone": profile.phone,
        "website": profile.website,
        "industry": profile.industry,
        "company_size": profile.company_size,
        "city": profile.city,
        "province": profile.province,
        "description": profile.description,
        "verification_document_name": (
            profile.verification_document_name
        ),
        "verification_status": (
            profile.verification_status
        ),
        "verification_rejection_reason": (
            profile.verification_rejection_reason
        ),
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


# =========================================================
# EMPLOYER VERIFICATION ENDPOINTS
# =========================================================

@router.get(
    "/employers",
    response_model=list[AdminEmployerResponse],
)
def list_employers(
    verification_status: Literal[
        "not_submitted",
        "pending",
        "approved",
        "rejected",
    ] | None = Query(
        default=None,
        alias="status",
    ),
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    query = (
        select(EmployerProfile, User)
        .join(
            User,
            EmployerProfile.user_id == User.id,
        )
        .order_by(
            EmployerProfile.created_at.desc()
        )
    )

    if verification_status:
        query = query.where(
            EmployerProfile.verification_status
            == verification_status
        )

    results = database.execute(query).all()

    return [
        admin_employer_response(
            profile,
            employer,
        )
        for profile, employer in results
    ]


@router.get(
    "/employers/{employer_profile_id}",
    response_model=AdminEmployerResponse,
)
def get_employer(
    employer_profile_id: int,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    result = database.execute(
        select(EmployerProfile, User)
        .join(
            User,
            EmployerProfile.user_id == User.id,
        )
        .where(
            EmployerProfile.id
            == employer_profile_id
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The employer profile was not found"
            ),
        )

    profile, employer = result

    return admin_employer_response(
        profile,
        employer,
    )


@router.get(
    "/employers/{employer_profile_id}"
    "/verification-document",
)
def download_employer_verification_document(
    employer_profile_id: int,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    profile = database.get(
        EmployerProfile,
        employer_profile_id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The employer profile was not found"
            ),
        )

    if not profile.verification_document_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "This employer has not uploaded "
                "a verification document"
            ),
        )

    document_path = Path(
        profile.verification_document_path
    )

    if not document_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The verification document "
                "could not be found"
            ),
        )

    return FileResponse(
        path=document_path,
        filename=(
            profile.verification_document_name
            or document_path.name
        ),
    )


@router.patch(
    "/employers/{employer_profile_id}"
    "/verification",
    response_model=AdminEmployerResponse,
)
def review_employer_verification(
    employer_profile_id: int,
    decision_data: EmployerVerificationDecision,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    result = database.execute(
        select(EmployerProfile, User)
        .join(
            User,
            EmployerProfile.user_id == User.id,
        )
        .where(
            EmployerProfile.id
            == employer_profile_id
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The employer profile was not found"
            ),
        )

    profile, employer = result

    if profile.verification_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Only pending verification requests "
                "can be reviewed"
            ),
        )

    if decision_data.decision == "rejected":
        if (
            not decision_data.reason
            or not decision_data.reason.strip()
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "A rejection reason is required"
                ),
            )

        profile.verification_status = "rejected"
        profile.verification_rejection_reason = (
            decision_data.reason.strip()
        )

        action = "EMPLOYER_REJECTED"

        description = (
            f"{profile.organisation_name} was rejected. "
            f"Reason: "
            f"{profile.verification_rejection_reason}"
        )

        notification_title = (
            "Organisation verification rejected"
        )

        notification_message = (
            "Your organisation verification was "
            "rejected. Reason: "
            f"{profile.verification_rejection_reason}"
        )

        notification_type = "EMPLOYER_REJECTED"

    else:
        profile.verification_status = "approved"
        profile.verification_rejection_reason = None

        action = "EMPLOYER_APPROVED"

        description = (
            f"{profile.organisation_name} "
            "was approved."
        )

        notification_title = (
            "Organisation approved"
        )

        notification_message = (
            "Your organisation has been verified. "
            "You can now submit opportunities "
            "for administrator review."
        )

        notification_type = "EMPLOYER_APPROVED"

    activity = AdminActivity(
        admin_user_id=current_admin.id,
        action=action,
        target_type="employer_profile",
        target_id=profile.id,
        description=description,
    )

    create_notification(
        database=database,
        user_id=employer.id,
        notification_type=notification_type,
        title=notification_title,
        message=notification_message,
        related_type="employer_profile",
        related_id=profile.id,
    )

    database.add(activity)
    database.commit()
    database.refresh(profile)

    return admin_employer_response(
        profile,
        employer,
    )


# =========================================================
# OPPORTUNITY REVIEW HELPERS
# =========================================================

def build_admin_opportunity_response(
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
        "rejection_reason": (
            opportunity.rejection_reason
        ),
        "created_at": opportunity.created_at,
        "updated_at": opportunity.updated_at,
    }


# =========================================================
# OPPORTUNITY REVIEW ENDPOINTS
# =========================================================

@router.get(
    "/opportunities",
    response_model=list[AdminOpportunityResponse],
)
def list_opportunities_for_review(
    opportunity_status: Literal[
        "draft",
        "pending",
        "published",
        "rejected",
        "closed",
    ] | None = Query(
        default="pending",
        alias="status",
    ),
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    query = (
        select(Opportunity, EmployerProfile)
        .join(
            EmployerProfile,
            Opportunity.employer_profile_id
            == EmployerProfile.id,
        )
        .order_by(
            Opportunity.created_at.desc()
        )
    )

    if opportunity_status:
        query = query.where(
            Opportunity.status
            == opportunity_status
        )

    results = database.execute(query).all()

    return [
        build_admin_opportunity_response(
            opportunity,
            employer_profile,
        )
        for opportunity, employer_profile in results
    ]


@router.get(
    "/opportunities/{opportunity_id}",
    response_model=AdminOpportunityResponse,
)
def get_opportunity_for_review(
    opportunity_id: int,
    current_admin: User = Depends(
        require_roles("admin")
    ),
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
            Opportunity.id == opportunity_id
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The opportunity was not found"
            ),
        )

    opportunity, employer_profile = result

    return build_admin_opportunity_response(
        opportunity,
        employer_profile,
    )


@router.patch(
    "/opportunities/{opportunity_id}/review",
    response_model=AdminOpportunityResponse,
)
def review_opportunity(
    opportunity_id: int,
    review_data: OpportunityReviewDecision,
    current_admin: User = Depends(
        require_roles("admin")
    ),
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
            Opportunity.id == opportunity_id
        )
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The opportunity was not found"
            ),
        )

    opportunity, employer_profile = result

    if opportunity.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Only pending opportunities "
                "can be reviewed"
            ),
        )

    if review_data.decision == "approved":
        opportunity.status = "published"
        opportunity.rejection_reason = None

        action = "OPPORTUNITY_PUBLISHED"

        description = (
            f'Opportunity "{opportunity.title}" '
            "was approved and published."
        )

        notification_title = (
            "Opportunity published"
        )

        notification_message = (
            f'Your opportunity "{opportunity.title}" '
            "was approved and is now visible "
            "to job seekers."
        )

        notification_type = (
            "OPPORTUNITY_PUBLISHED"
        )

    else:
        if (
            not review_data.reason
            or not review_data.reason.strip()
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "A rejection reason is required"
                ),
            )

        opportunity.status = "rejected"
        opportunity.rejection_reason = (
            review_data.reason.strip()
        )

        action = "OPPORTUNITY_REJECTED"

        description = (
            f'Opportunity "{opportunity.title}" '
            f"was rejected. Reason: "
            f"{opportunity.rejection_reason}"
        )

        notification_title = (
            "Opportunity rejected"
        )

        notification_message = (
            f'Your opportunity "{opportunity.title}" '
            "was rejected. Reason: "
            f"{opportunity.rejection_reason}"
        )

        notification_type = (
            "OPPORTUNITY_REJECTED"
        )

    activity = AdminActivity(
        admin_user_id=current_admin.id,
        action=action,
        target_type="opportunity",
        target_id=opportunity.id,
        description=description,
    )

    create_notification(
        database=database,
        user_id=employer_profile.user_id,
        notification_type=notification_type,
        title=notification_title,
        message=notification_message,
        related_type="opportunity",
        related_id=opportunity.id,
    )

    database.add(activity)
    database.commit()
    database.refresh(opportunity)

    return build_admin_opportunity_response(
        opportunity,
        employer_profile,
    )


# =========================================================
# USER MANAGEMENT ENDPOINTS
# =========================================================

@router.get(
    "/users",
    response_model=list[AdminUserResponse],
)
def list_users(
    user_role: Literal[
        "job_seeker",
        "employer",
        "admin",
    ] | None = Query(
        default=None,
        alias="role",
    ),
    active: bool | None = Query(default=None),
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    query = select(User).order_by(
        User.created_at.desc()
    )

    if user_role:
        query = query.where(
            User.role == user_role
        )

    if active is not None:
        query = query.where(
            User.is_active == active
        )

    return database.scalars(query).all()


@router.get(
    "/users/{user_id}",
    response_model=AdminUserResponse,
)
def get_user_account(
    user_id: int,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    user = database.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The user account was not found"
            ),
        )

    return user


@router.patch(
    "/users/{user_id}/status",
    response_model=AdminUserResponse,
)
def update_user_account_status(
    user_id: int,
    status_data: UserAccountStatusUpdate,
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    user = database.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "The user account was not found"
            ),
        )

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "You cannot suspend or activate "
                "your own administrator account"
            ),
        )

    if status_data.action == "suspend":
        if (
            not status_data.reason
            or not status_data.reason.strip()
        ):
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "A suspension reason is required"
                ),
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This account is already suspended"
                ),
            )

        user.is_active = False

        action = "USER_SUSPENDED"

        description = (
            f"User {user.email} was suspended. "
            f"Reason: {status_data.reason.strip()}"
        )

        notification_title = (
            "Account suspended"
        )

        notification_message = (
            "Your GraduateLink SA account was "
            "suspended. Reason: "
            f"{status_data.reason.strip()}"
        )

    else:
        if user.is_active:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This account is already active"
                ),
            )

        user.is_active = True

        action = "USER_ACTIVATED"

        description = (
            f"User {user.email} was reactivated."
        )

        notification_title = (
            "Account reactivated"
        )

        notification_message = (
            "Your GraduateLink SA account has "
            "been reactivated."
        )

    activity = AdminActivity(
        admin_user_id=current_admin.id,
        action=action,
        target_type="user",
        target_id=user.id,
        description=description,
    )

    create_notification(
        database=database,
        user_id=user.id,
        notification_type=action,
        title=notification_title,
        message=notification_message,
        related_type="user",
        related_id=user.id,
    )

    database.add(activity)
    database.commit()
    database.refresh(user)

    return user


# =========================================================
# ADMINISTRATOR DASHBOARD
# =========================================================

@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
)
def get_admin_dashboard(
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    recent_activities = database.scalars(
        select(AdminActivity)
        .order_by(
            AdminActivity.created_at.desc()
        )
        .limit(10)
    ).all()

    return {
        "total_users": count_records(
            database,
            User,
        ),
        "active_users": count_records(
            database,
            User,
            User.is_active.is_(True),
        ),
        "suspended_users": count_records(
            database,
            User,
            User.is_active.is_(False),
        ),
        "total_job_seekers": count_records(
            database,
            User,
            User.role == "job_seeker",
        ),
        "total_employers": count_records(
            database,
            User,
            User.role == "employer",
        ),
        "total_admins": count_records(
            database,
            User,
            User.role == "admin",
        ),
        "pending_employer_verifications": (
            count_records(
                database,
                EmployerProfile,
                EmployerProfile.verification_status
                == "pending",
            )
        ),
        "approved_employers": count_records(
            database,
            EmployerProfile,
            EmployerProfile.verification_status
            == "approved",
        ),
        "pending_opportunities": count_records(
            database,
            Opportunity,
            Opportunity.status == "pending",
        ),
        "published_opportunities": count_records(
            database,
            Opportunity,
            Opportunity.status == "published",
        ),
        "rejected_opportunities": count_records(
            database,
            Opportunity,
            Opportunity.status == "rejected",
        ),
        "recent_activities": recent_activities,
    }


# =========================================================
# ADMINISTRATOR ACTIVITY HISTORY
# =========================================================

@router.get(
    "/activities",
    response_model=list[AdminActivityResponse],
)
def list_admin_activities(
    action: str | None = Query(default=None),
    target_type: str | None = Query(default=None),
    limit: int = Query(
        default=50,
        ge=1,
        le=200,
    ),
    current_admin: User = Depends(
        require_roles("admin")
    ),
    database: Session = Depends(get_database),
):
    query = select(AdminActivity)

    if action:
        query = query.where(
            AdminActivity.action == action
        )

    if target_type:
        query = query.where(
            AdminActivity.target_type
            == target_type
        )

    query = (
        query
        .order_by(
            AdminActivity.created_at.desc()
        )
        .limit(limit)
    )

    return database.scalars(query).all()
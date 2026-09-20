"""Public appeal submission and administrator review."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_database
from ..dependencies import require_roles
from ..email_service import send_account_email_safely
from ..models import AccountAppeal, AdminActivity, User
from ..notification_service import create_notification

router = APIRouter(prefix="/api", tags=["Account appeals"])

class AppealRequest(BaseModel):
    email: EmailStr
    message: str = Field(min_length=20, max_length=2000)

class AppealDecision(BaseModel):
    decision: str = Field(pattern="^(restore|deny)$")
    reason: str = Field(min_length=5, max_length=1000)

class AppealResponse(BaseModel):
    id: int
    user_id: int
    email: EmailStr
    message: str
    status: str
    decision_reason: str | None
    created_at: datetime


def describe(appeal: AccountAppeal, user: User) -> dict:
    return dict(id=appeal.id, user_id=user.id, email=user.email, message=appeal.message,
                status=appeal.status, decision_reason=appeal.decision_reason, created_at=appeal.created_at)

@router.post("/auth/appeals")
def submit_appeal(data: AppealRequest, database: Session = Depends(get_database)):
    # Same response for unknown, active and suspended emails to prevent account discovery.
    response = {"message": "If this email belongs to a suspended account, your appeal has been received."}
    user = database.scalar(select(User).where(User.email == data.email.lower()))
    if not user or user.is_active or user.role == "admin":
        return response
    existing = database.scalar(select(AccountAppeal).where(AccountAppeal.user_id == user.id,
                                                           AccountAppeal.status == "pending"))
    if existing:
        return response
    appeal = AccountAppeal(user_id=user.id, message=data.message.strip())
    database.add(appeal)
    database.flush()
    for admin in database.scalars(select(User).where(User.role == "admin", User.is_active.is_(True))):
        create_notification(database, admin.id, "APPEAL_RECEIVED", "Account appeal received",
                            f"A user submitted an account appeal (case #{appeal.id}).", "appeal", appeal.id)
    database.commit()
    send_account_email_safely(user.email, "GraduateLink SA: appeal received",
        f"Your appeal has been received (case #{appeal.id}). An administrator will review it.\n"
        f"For questions contact {settings.support_email or 'GraduateLink SA support'}.\n")
    return response

@router.get("/admin/appeals", response_model=list[AppealResponse])
def list_appeals(admin: User = Depends(require_roles("admin")), database: Session = Depends(get_database)):
    rows = database.execute(select(AccountAppeal, User).join(User, User.id == AccountAppeal.user_id)
                            .order_by(AccountAppeal.created_at.desc()).limit(200)).all()
    return [describe(appeal, user) for appeal, user in rows]

@router.patch("/admin/appeals/{appeal_id}", response_model=AppealResponse)
def review_appeal(appeal_id: int, data: AppealDecision,
                  admin: User = Depends(require_roles("admin")), database: Session = Depends(get_database)):
    appeal = database.get(AccountAppeal, appeal_id)
    if not appeal:
        raise HTTPException(404, "Appeal not found")
    if appeal.status != "pending":
        raise HTTPException(409, "This appeal has already been reviewed")
    user = database.get(User, appeal.user_id)
    if not user:
        raise HTTPException(404, "Account not found")
    if user.is_active:
        raise HTTPException(409, "This account is already active")
    appeal.status = "restored" if data.decision == "restore" else "denied"
    appeal.decision_reason = data.reason.strip()
    appeal.reviewer_id = admin.id
    appeal.reviewed_at = datetime.now(timezone.utc)
    if data.decision == "restore":
        user.is_active = True
    database.add(AdminActivity(admin_user_id=admin.id, action="APPEAL_" + appeal.status.upper(),
                               target_type="user", target_id=user.id,
                               description=f"Appeal #{appeal.id}: {appeal.status}. Reason: {appeal.decision_reason}"))
    create_notification(database, user.id, "APPEAL_" + appeal.status.upper(), "Appeal decision",
                        f"Your account appeal was {appeal.status}. Reason: {appeal.decision_reason}", "appeal", appeal.id)
    database.commit()
    send_account_email_safely(user.email, "GraduateLink SA: appeal decision",
        f"Your appeal (case #{appeal.id}) was {appeal.status}.\n"
        f"Reason: {appeal.decision_reason}\n"
        f"For questions contact {settings.support_email or 'GraduateLink SA support'}.\n")
    return describe(appeal, user)

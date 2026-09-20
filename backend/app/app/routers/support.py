from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_database
from ..dependencies import bearer_scheme, require_roles
from ..models import SupportRequest, User
from ..notification_service import create_notification
from ..security import decode_access_token
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/api", tags=["Support"])
class SupportRequestInput(BaseModel):
    email: EmailStr
    question: str = Field(min_length=10, max_length=2000)

@router.post("/support-requests")
def create_support_request(data: SupportRequestInput,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    database: Session = Depends(get_database)):
    user = None
    if credentials:
        try:
            user = database.get(User, int(decode_access_token(credentials.credentials)["sub"]))
        except Exception:
            pass
    request = SupportRequest(email=data.email.lower(), question=data.question.strip(),
                             user_id=user.id if user and user.is_active else None)
    database.add(request)
    database.flush()
    for admin in database.scalars(select(User).where(User.role == "admin", User.is_active.is_(True))):
        create_notification(database, admin.id, "SUPPORT_REQUEST", "Support request received",
                            f"Support request #{request.id} needs review.", "support_request", request.id)
    database.commit()
    return {"message": "Your support request has been sent to the administrators."}

@router.get("/admin/support-requests")
def list_support_requests(admin: User = Depends(require_roles("admin")),
                          database: Session = Depends(get_database)):
    return [{"id": r.id, "email": r.email, "question": r.question, "status": r.status,
             "created_at": r.created_at} for r in database.scalars(
        select(SupportRequest).order_by(SupportRequest.created_at.desc()).limit(200))]

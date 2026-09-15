from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from ..database import get_database
from ..dependencies import get_current_user
from ..models import Notification, User
from ..schemas import (
    MessageResponse,
    NotificationResponse,
    NotificationUnreadCountResponse,
)


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)


@router.get(
    "",
    response_model=list[NotificationResponse],
)
def list_my_notifications(
    unread_only: bool = Query(default=False),
    limit: int = Query(
        default=50,
        ge=1,
        le=200,
    ),
    current_user: User = Depends(get_current_user),
    database: Session = Depends(get_database),
):
    query = select(Notification).where(
        Notification.user_id == current_user.id
    )

    if unread_only:
        query = query.where(
            Notification.is_read.is_(False)
        )

    query = (
        query
        .order_by(Notification.created_at.desc())
        .limit(limit)
    )

    return database.scalars(query).all()


@router.get(
    "/unread-count",
    response_model=NotificationUnreadCountResponse,
)
def get_unread_notification_count(
    current_user: User = Depends(get_current_user),
    database: Session = Depends(get_database),
):
    unread_count = database.scalar(
        select(func.count())
        .select_from(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
    ) or 0

    return {
        "unread_count": unread_count,
    }


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    database: Session = Depends(get_database),
):
    notification = database.scalar(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The notification was not found",
        )

    notification.is_read = True

    database.commit()
    database.refresh(notification)

    return notification


@router.patch(
    "/read-all",
    response_model=MessageResponse,
)
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    database: Session = Depends(get_database),
):
    database.execute(
        update(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
        .values(is_read=True)
    )

    database.commit()

    return {
        "message": (
            "All notifications were marked as read"
        )
    }


@router.delete(
    "/{notification_id}",
    response_model=MessageResponse,
)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    database: Session = Depends(get_database),
):
    notification = database.scalar(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The notification was not found",
        )

    database.delete(notification)
    database.commit()

    return {
        "message": "Notification deleted"
    }
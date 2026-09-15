from sqlalchemy.orm import Session

from .models import Notification


def create_notification(
    database: Session,
    user_id: int,
    notification_type: str,
    title: str,
    message: str,
    related_type: str | None = None,
    related_id: int | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        related_type=related_type,
        related_id=related_id,
    )

    database.add(notification)

    return notification
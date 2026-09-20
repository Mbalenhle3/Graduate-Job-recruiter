from datetime import datetime

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    notification_type: str
    title: str
    message: str
    related_type: str | None
    related_id: int | None
    is_read: bool
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class NotificationUnreadCountResponse(BaseModel):
    unread_count: int
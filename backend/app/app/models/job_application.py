from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    __table_args__ = (
        CheckConstraint(
            "status IN ("
            "'submitted', "
            "'under_review', "
            "'shortlisted', "
            "'rejected', "
            "'withdrawn', "
            "'hired'"
            ")",
            name="valid_job_application_status",
        ),
        UniqueConstraint(
            "job_seeker_profile_id",
            "opportunity_id",
            name="unique_job_seeker_application",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    job_seeker_profile_id: Mapped[int] = mapped_column(
        ForeignKey(
            "job_seeker_profiles.user_id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    opportunity_id: Mapped[int] = mapped_column(
        ForeignKey(
            "opportunities.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    cover_letter: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    resume_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    resume_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="submitted",
        nullable=False,
        index=True,
    )

    employer_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
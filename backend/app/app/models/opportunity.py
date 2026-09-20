from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    __table_args__ = (
        CheckConstraint(
            "work_mode IN "
            "('on_site', 'hybrid', 'remote')",
            name="valid_opportunity_work_mode",
        ),
        CheckConstraint(
            "opportunity_type IN "
            "('graduate_programme', 'internship', "
            "'learnership', 'entry_level_job')",
            name="valid_opportunity_type",
        ),
        CheckConstraint(
            "status IN "
            "('draft', 'pending', 'published', "
            "'rejected', 'closed')",
            name="valid_opportunity_status",
        ),
        CheckConstraint(
            "required_experience_years >= 0",
            name="valid_required_experience",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    employer_profile_id: Mapped[int] = mapped_column(
        ForeignKey(
            "employer_profiles.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    requirements: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    qualification: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    province: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    work_mode: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    opportunity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    required_experience_years: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    closing_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="draft",
        nullable=False,
        index=True,
    )

    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
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
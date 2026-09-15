from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    __table_args__ = (
        CheckConstraint(
            "verification_status IN "
            "('not_submitted', 'pending', 'approved', 'rejected')",
            name="valid_employer_verification_status",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    contact_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    organisation_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    registration_number: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    contact_email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    industry: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    company_size: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    province: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    verification_document_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    verification_document_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    verification_status: Mapped[str] = mapped_column(
        String(30),
        default="not_submitted",
        nullable=False,
        index=True,
    )

    verification_rejection_reason: Mapped[str | None] = mapped_column(
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
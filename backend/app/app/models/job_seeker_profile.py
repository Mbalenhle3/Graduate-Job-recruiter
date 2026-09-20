from sqlalchemy import ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        default="",
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(30),
        default="",
        nullable=False,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        default="",
        nullable=False,
    )

    province: Mapped[str] = mapped_column(
        String(100),
        default="",
        nullable=False,
    )

    qualification: Mapped[str] = mapped_column(
        String(200),
        default="",
        nullable=False,
    )

    institution: Mapped[str] = mapped_column(
        String(200),
        default="",
        nullable=False,
    )

    study_status: Mapped[str] = mapped_column(
        String(50),
        default="",
        nullable=False,
    )

    graduation_year: Mapped[str] = mapped_column(
        String(10),
        default="",
        nullable=False,
    )

    professional_summary: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )

    preferred_roles: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    preferred_work_mode: Mapped[str] = mapped_column(
        String(30),
        default="Any",
        nullable=False,
    )

    availability: Mapped[str] = mapped_column(
        String(50),
        default="",
        nullable=False,
    )

    skills: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    projects: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    cv_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    cv_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
from sqlalchemy import inspect, text

from .database import Base, engine
from .models import (
    AccountAppeal,
    SupportRequest,
    AdminActivity,
    AdminProfile,
    EmployerProfile,
    JobApplication,
    JobSeekerProfile,
    Notification,
    Opportunity,
    PasswordResetToken,
    SavedOpportunity,
    User,
)


def create_tables():
    Base.metadata.create_all(bind=engine)

    # create_all creates new tables but does not add columns to existing
    # tables. These small idempotent upgrades preserve existing data.
    inspector = inspect(engine)
    opportunity_columns = {
        column["name"]
        for column in inspector.get_columns("opportunities")
    }
    profile_columns = {
        column["name"]
        for column in inspector.get_columns("job_seeker_profiles")
    }

    with engine.begin() as connection:
        if "required_skills" not in opportunity_columns:
            connection.execute(text(
                "ALTER TABLE opportunities "
                "ADD COLUMN required_skills JSON NOT NULL DEFAULT '[]'"
            ))
        if "experience_years" not in profile_columns:
            connection.execute(text(
                "ALTER TABLE job_seeker_profiles "
                "ADD COLUMN experience_years INTEGER NOT NULL DEFAULT 0"
            ))

    print(
        "GraduateLink SA database tables "
        "created successfully."
    )


if __name__ == "__main__":
    create_tables()

from .database import Base, engine
from .models import (
    EmployerProfile,
    JobSeekerProfile,
    PasswordResetToken,
    User,
)

def create_tables():
    Base.metadata.create_all(bind=engine)

    print(
        "GraduateLink SA database tables "
        "created successfully."
    )


if __name__ == "__main__":
    create_tables()
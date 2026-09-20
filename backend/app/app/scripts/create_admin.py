from getpass import getpass

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..database import engine
from ..models import (
    AdminActivity,
    AdminProfile,
    User,
)
from ..security import hash_password


def required_input(label: str) -> str:
    while True:
        value = input(label).strip()

        if value:
            return value

        print("This value is required.")


def read_password() -> str:
    while True:
        password = getpass(
            "Password: "
        )

        if len(password) < 8:
            print(
                "The password must contain at least "
                "8 characters."
            )
            continue

        confirmation = getpass(
            "Confirm password: "
        )

        if password != confirmation:
            print("The passwords do not match.")
            continue

        return password


def create_admin():
    print()
    print("Create GraduateLink SA Administrator")
    print("------------------------------------")

    first_name = required_input(
        "First name: "
    )

    last_name = required_input(
        "Last name: "
    )

    email = required_input(
        "Email address: "
    ).lower()

    phone = input(
        "Phone number (optional): "
    ).strip() or None

    job_title = input(
        "Job title (optional): "
    ).strip() or None

    department = input(
        "Department (optional): "
    ).strip() or None

    password = read_password()

    with Session(engine) as database:
        existing_user = database.scalar(
            select(User).where(
                User.email == email
            )
        )

        if existing_user:
            print()
            print(
                "An account already exists with "
                "this email address."
            )
            print(
                "An existing account was not changed "
                "into an administrator."
            )
            return

        try:
            admin = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password_hash=hash_password(
                    password
                ),
                role="admin",
                is_active=True,
            )

            database.add(admin)
            database.flush()

            profile = AdminProfile(
                user_id=admin.id,
                phone=phone,
                job_title=job_title,
                department=department,
            )

            database.add(profile)

            activity = AdminActivity(
                admin_user_id=admin.id,
                action="ADMIN_CREATED",
                target_type="user",
                target_id=admin.id,
                description=(
                    f"Administrator account created "
                    f"for {first_name} {last_name}."
                ),
            )

            database.add(activity)
            database.commit()

        except SQLAlchemyError:
            database.rollback()

            print()
            print(
                "The administrator account could "
                "not be created."
            )

            raise

    print()
    print("Administrator created successfully.")
    print(f"Email: {email}")
    print("Role: admin")


if __name__ == "__main__":
    create_admin()
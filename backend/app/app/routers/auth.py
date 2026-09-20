from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
import smtplib
from ..email_service import send_password_reset_email
from ..config import settings
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from ..database import get_database
from ..dependencies import get_current_user
from ..models import PasswordResetToken, User
from ..schemas import (
    AuthenticationResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    MessageResponse,
    ResetPasswordRequest,
    SigninRequest,
    SignupRequest,
    UserResponse,
)

from ..security import (
    create_access_token,
    generate_reset_token,
    hash_password,
    hash_reset_token,
    verify_password,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/signup",
    response_model=AuthenticationResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    signup_data: SignupRequest,
    database: Session = Depends(get_database),
):
    email = signup_data.email.lower()

    existing_user = database.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already uses this email",
        )

    user = User(
        first_name=signup_data.first_name.strip(),
        last_name=signup_data.last_name.strip(),
        email=email,
        password_hash=hash_password(signup_data.password),
        role=signup_data.role,
    )

    database.add(user)
    database.commit()
    database.refresh(user)

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.post(
    "/signin",
    response_model=AuthenticationResponse,
)
def signin(
    signin_data: SigninRequest,
    database: Session = Depends(get_database),
):
    email = signin_data.email.lower()

    user = database.scalar(
        select(User).where(User.email == email)
    )

    if not user or not verify_password(
        signin_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is suspended",
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot_password(
    request_data: ForgotPasswordRequest,
    database: Session = Depends(get_database),
):
    message = (
        "If the email exists, password reset instructions "
        "have been created."
    )

    email = request_data.email.lower()

    user = database.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        return {
            "message": message,
            "reset_token": None,
        }

    previous_tokens = database.scalars(
        select(PasswordResetToken).where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used.is_(False),
        )
    ).all()

    for previous_token in previous_tokens:
        previous_token.is_used = True

    reset_token = generate_reset_token()

    password_reset = PasswordResetToken(
        user_id=user.id,
        token_hash=hash_reset_token(reset_token),
        expires_at=(
            datetime.now(timezone.utc)
            + timedelta(minutes=30)
        ),
    )

    database.add(password_reset)

    try:
        send_password_reset_email(user.email, reset_token)
        database.commit()
    except (smtplib.SMTPException, OSError) as error:
        print("EMAIL ERROR:", repr(error))
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email could not be sent. Please try again later.",
        )

    return {
        "message": message,
        "reset_token": None,
    }


@router.post(
    "/reset-password",
    response_model=MessageResponse,
)
def reset_password(
    request_data: ResetPasswordRequest,
    database: Session = Depends(get_database),
):
    current_time = datetime.now(timezone.utc)

    password_reset = database.scalar(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash
            == hash_reset_token(request_data.token),
            PasswordResetToken.is_used.is_(False),
        )
    )

    if (
        not password_reset
        or password_reset.expires_at < current_time
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The reset token is invalid or expired",
        )

    user = database.get(
        User,
        password_reset.user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The reset token is invalid",
        )

    user.password_hash = hash_password(
        request_data.new_password
    )

    password_reset.is_used = True

    database.commit()

    return {
        "message": "Password updated successfully"
    }

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_account(
    current_user: User = Depends(get_current_user),
):
    return current_user
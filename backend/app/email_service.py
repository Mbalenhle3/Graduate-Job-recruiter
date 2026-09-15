import smtplib
import ssl
from email.message import EmailMessage
from urllib.parse import quote

from .config import settings


def send_password_reset_email(
    to_email: str,
    token: str,
) -> None:
    reset_link = (
        f"{settings.frontend_url.rstrip('/')}/reset-password"
        f"?token={quote(token, safe='')}"
    )

    message = EmailMessage()
    message["Subject"] = "Reset your GraduateLink SA password"
    message["From"] = settings.smtp_username
    message["To"] = to_email

    message.set_content(
        "We received a request to reset your password.\n\n"
        "Open the link below to create a new password:\n\n"
        f"{reset_link}\n\n"
        "This link will expire in 30 minutes.\n\n"
        "If you did not request this password reset, "
        "you can ignore this email."
    )

    security_context = ssl.create_default_context()

    with smtplib.SMTP(
        settings.smtp_host,
        settings.smtp_port,
        timeout=15,
    ) as smtp:
        smtp.ehlo()
        smtp.starttls(context=security_context)
        smtp.ehlo()
        print("SMTP USER:", repr(settings.smtp_username))
        print("SMTP PASSWORD LENGTH:", len(settings.smtp_password))
        print(
            "SMTP PASSWORD HAS SPACES:",
            " " in settings.smtp_password,
        )
        smtp.login(
            settings.smtp_username,
            settings.smtp_password,
        )

        smtp.send_message(message)
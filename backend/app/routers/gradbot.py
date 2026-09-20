"""Role-aware GradBot using approved knowledge and an optional local adapter."""
import logging
import os
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_database
from ..dependencies import bearer_scheme, require_roles
from ..models import User, JobSeekerProfile
from ..security import decode_access_token
from ..services.gradbot_ml import answer as local_answer
from ..services.gradbot_smalltalk import respond as smalltalk_reply
from ..services.gradbot_model import explain as model_explain

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/gradbot", tags=["GradBot"])
DISCLAIMER = ("Disclaimer: GradBot provides advisory guidance only. Matches, CV checks, "
              "and interview feedback do not guarantee employment or constitute recruitment decisions")
FALLBACK = "I don't have enough reliable information from GraduateLink SA to answer that question accurately. Please contact platform support."

class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)

class ChatResponse(BaseModel):
    answer: str
    links: list[str] = []
    suggested_questions: list[str] = []


def optional_user(credentials: HTTPAuthorizationCredentials | None, database: Session) -> User | None:
    if credentials is None:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        user = database.get(User, int(payload["sub"]))
        return user if user and user.is_active else None
    except Exception:
        return None

@router.post("/chat", response_model=ChatResponse)
def chat(data: ChatRequest, credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
         database: Session = Depends(get_database)):
    user = optional_user(credentials, database)
    role = user.role if user else "visitor"
    # Handle a few conversation starters without sending them to knowledge search.
    simple_answer = smalltalk_reply(data.message, role)
    if simple_answer:
        return ChatResponse(
            answer=simple_answer,
            suggested_questions=["How do I apply for a job?", "How do I reset my password?"],
        )
    # Never pass likely credentials into a model prompt.
    if any(word in data.message.lower() for word in ("my password is", "my token is", "bearer ", "my otp is")):
        return ChatResponse(answer="Please don't share passwords or tokens in chat. Use Forgot password if needed.",
                            links=["/forgot-password"])
    try:
        answer, links = local_answer(data.message, role)
    except (OSError, ValueError, KeyError, TimeoutError) as error:
        logger.warning("GradBot local model unavailable: %s", type(error).__name__)
        return ChatResponse(answer="GradBot is temporarily unavailable. Please try again later or contact support.",
                            links=["/support"])
    # Retrieval enforces role visibility before the model sees any document.
    # Unmatched questions are never sent to the model to improvise an answer.
    if os.getenv('GRADBOT_MODEL_ENABLED', '0') == '1' and answer != FALLBACK and '/support' not in links:
        try:
            candidate = model_explain(data.message, role, answer)
            # The model must not grant capabilities or redirect a public user
            # into a protected area. Always keep links from retrieval only.
            if (candidate and len(candidate) <= 1600 and
                (role == 'admin' or '/admin/' not in candidate.lower()) and
                (role in ('admin', 'employer') or '/employer/' not in candidate.lower()) and
                (role in ('admin', 'job_seeker') or '/job-seeker/' not in candidate.lower())):
                answer = candidate
                if any(term in data.message.lower() for term in ('cv', 'resume', 'interview', 'career', 'match', 'score')):
                    if DISCLAIMER not in answer:
                        answer += '\n\n' + DISCLAIMER
        except Exception:
            logger.exception('GradBot adapter unavailable; using approved knowledge answer')
    return ChatResponse(answer=answer, links=links,
                        suggested_questions=["How do I reset my password?", "How do I appeal a suspension?"])

class CVDraft(BaseModel):
    """Editable draft; nothing is saved to the database or existing uploaded CV."""
    text: str
    missing_fields: list[str]


def build_cv_draft(user: User, profile: JobSeekerProfile | None) -> CVDraft:
    name = " ".join(x for x in (user.first_name, user.last_name) if x).strip()
    if not name and profile:
        name = (profile.full_name or "").strip()
    missing = []
    if not name:
        missing.append("name")
    if not profile or not profile.phone:
        missing.append("phone")
    if not profile or not profile.professional_summary:
        missing.append("professional summary")
    if not profile or not profile.qualification:
        missing.append("qualification")
    if not profile or not profile.institution:
        missing.append("institution")
    if not profile or not profile.skills:
        missing.append("skills")
    parts = [name or "[Your full name]", user.email]
    if profile:
        contact = [v for v in (profile.phone, profile.city, profile.province) if v]
        if contact:
            parts.append(" | ".join(contact))
        if profile.professional_summary:
            parts += ["", "PROFESSIONAL SUMMARY", profile.professional_summary.strip()]
        education = [v for v in (profile.qualification, profile.institution,
                                 profile.study_status, profile.graduation_year) if v and v != "0"]
        if education:
            parts += ["", "EDUCATION", " | ".join(education)]
        if profile.skills:
            parts += ["", "SKILLS", ", ".join(str(v) for v in profile.skills if v)]
        if profile.projects:
            parts += ["", "PROJECTS AND EXPERIENCE"]
            parts += ["- " + str(v) for v in profile.projects if v]
    return CVDraft(text="\n".join(parts).strip() + "\n", missing_fields=missing)


@router.get("/me/cv-draft", response_model=CVDraft)
def my_cv_draft(current_user: User = Depends(require_roles("job_seeker")),
                database: Session = Depends(get_database)):
    return build_cv_draft(current_user, database.get(JobSeekerProfile, current_user.id))

"""GradBot: role-aware, read-only guidance grounded in known application routes.
No generative model or access to other people's private data.
"""
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_database
from ..dependencies import bearer_scheme
from ..models import User, JobSeekerProfile
from ..security import decode_access_token

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
    q = data.message.lower().strip()
    role = user.role if user else "visitor"
    answer, links, advisory = FALLBACK, [], False
    if any(w in q for w in ("password", "sign in", "login", "log in")):
        answer = "Choose your account area on the home page to sign in. If you forgot your password, use Forgot password to receive a reset link by email. Never share a password in chat."
        links = ["/", "/forgot-password"]
    elif any(w in q for w in ("suspend", "appeal", "restore account")):
        answer = "A suspended account cannot sign in. Read the suspension email for the reason, then submit an appeal for an administrator to review. Restoration is not automatic."
        links = ["/appeal"]
    elif any(w in q for w in ("register", "sign up", "create account")):
        answer = "On the home page, select Job Seeker or Employer and choose Create account. Administrator accounts are created by platform administrators."
        links = ["/"]
    elif role == "job_seeker" and any(w in q for w in ("profile", "cv", "resume", "skill")):
        profile = database.get(JobSeekerProfile, user.id)
        missing = ([name for name, value in (("qualification", profile.qualification), ("institution", profile.institution),
                   ("skills", profile.skills), ("professional summary", profile.professional_summary)) if not value] if profile else ["career profile"])
        answer = ("Your profile can be improved by adding: " + ", ".join(missing) + ". " if missing else "Your key profile fields are filled in. ")
        answer += "Add truthful qualifications, skills and experience. Use clear headings and concise achievement statements in your CV; you can upload a PDF on your career profile. " + DISCLAIMER
        links, advisory = ["/job-seeker/profile"], True
    elif role == "job_seeker" and any(w in q for w in ("application", "status", "apply")):
        answer = "Open Applications to check your own application status. GradBot cannot change an application status or promise an outcome."
        links = ["/job-seeker/applications"]
    elif role == "job_seeker" and q.startswith("my interview answer:"):
        body = q.split(":", 1)[1]
        cues = {"Situation": ("situation", "when ", "at "),
                "Task": ("task", "needed to", "had to"),
                "Action": ("action", "i did", "i worked", "i built", "i solved"),
                "Result": ("result", "outcome", "improved", "achieved")}
        missing = [part for part, words in cues.items() if not any(word in body for word in words)]
        answer = ("Your answer covers the four STAR sections. Add a clear, measurable result if you have one. "
                  if not missing else "Consider adding these STAR sections: " + ", ".join(missing) + ". ") + DISCLAIMER
        advisory = True
    elif role == "job_seeker" and any(w in q for w in ("interview", "star method")):
        answer = "Let's practise: Tell me about a time you solved a difficult problem. Structure your answer with Situation, Task, Action and Result. Reply with My interview answer: followed by your response for basic STAR feedback. " + DISCLAIMER
        links, advisory = ["/job-seeker/jobs"], True
    elif role == "job_seeker" and any(w in q for w in ("match", "score")):
        answer = "Job matches depend on your profile and the opportunity requirements. Review the displayed match and keep your skills and qualifications up to date. I cannot verify a fixed scoring formula from the current backend. " + DISCLAIMER
        links, advisory = ["/job-seeker/jobs", "/job-seeker/profile"], True
    elif role == "employer" and any(w in q for w in ("verify", "verification", "document", "organisation", "company")):
        answer = "Complete the organisation profile, upload your verification document, then submit the verification request. An administrator reviews it before publishing is allowed."
        links = ["/employer/profile"]
    elif role == "employer" and any(w in q for w in ("draft", "screening question")):
        answer = ("Draft a posting with: job title; location and work mode; main duties; essential skills; "
                  "qualification requirements; experience needed; closing date; and how to apply. "
                  "For screening, ask only job-related questions about those requirements. "
                  "Do not include protected personal traits. Review the draft yourself before posting.")
        links = ["/employer/opportunities/new"]
    elif role == "employer" and any(w in q for w in ("post", "opportunity", "job")):
        answer = "Once your organisation is approved, create an opportunity with accurate requirements and a closing date, then submit it for administrator review."
        links = ["/employer/opportunities/new"]
    elif role == "admin" and any(w in q for w in ("support trend", "unanswered")):
        answer = "Chat questions are not stored in this version, so support trends and unanswered question counts are not available yet. Review activity in Reports."
        links = ["/admin/reports"]
    elif role == "admin" and any(w in q for w in ("appeal", "suspend", "account", "user")):
        answer = "Open Users to review account access and Appeals to review requests. Record a reason for every suspension or appeal decision; GradBot cannot make moderation decisions."
        links = ["/admin/users", "/admin/appeals"]
    elif role == "admin" and any(w in q for w in ("verify", "employer", "opportunity", "moderation")):
        answer = "Review employer verification documents and pending opportunities in their administrator pages. Decisions must be made by an administrator."
        links = ["/admin/employers", "/admin/opportunities"]
    elif role == "visitor":
        answer = "Choose Job Seeker or Employer on the home page to register or sign in. GradBot can explain public account steps; sign in to receive guidance for your account."
        links = ["/"]
    if answer == FALLBACK:
        links = ["/support"]
    return ChatResponse(answer=answer, links=links,
        suggested_questions=["How do I reset my password?", "How do I appeal a suspension?"])

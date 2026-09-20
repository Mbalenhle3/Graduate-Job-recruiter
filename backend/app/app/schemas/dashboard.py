from pydantic import BaseModel


class JobSeekerDashboardResponse(BaseModel):
    profile_strength: int
    total_applications: int
    active_applications: int
    shortlisted_applications: int
    rejected_applications: int
    saved_opportunities: int
    available_opportunities: int


class EmployerDashboardResponse(BaseModel):
    verification_status: str
    total_opportunities: int
    draft_opportunities: int
    pending_opportunities: int
    active_opportunities: int
    rejected_opportunities: int
    closed_opportunities: int
    total_applicants: int
    under_review_applicants: int
    shortlisted_applicants: int
    hired_applicants: int
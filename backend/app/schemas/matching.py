from pydantic import BaseModel


class MatchFactorResponse(BaseModel):
    key: str
    label: str
    weight: int
    score: float
    contribution: float
    message: str
    matched: list[str] | None = None
    missing: list[str] | None = None


class OpportunityMatchResponse(BaseModel):
    opportunity_id: int
    match_percentage: int
    factors: list[MatchFactorResponse]
    advisory_message: str

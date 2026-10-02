import re
from typing import Any

from ..models import JobSeekerProfile, Opportunity


WEIGHTS = {
    "required_skills": 40,
    "qualification": 25,
    "experience": 15,
    "location": 10,
    "profile_completeness": 10,
}


def _normalise(value: str | None) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip() if value else ""


def _normalised_set(values: list[str] | None) -> set[str]:
    return {_normalise(value) for value in (values or []) if _normalise(value)}


def _skills_score(profile: JobSeekerProfile, opportunity: Opportunity) -> tuple[float, dict[str, Any]]:
    required = _normalised_set(opportunity.required_skills)
    available = _normalised_set(profile.skills)
    if not required:
        return 100.0, {"matched": [], "missing": [], "message": "No required skills were specified."}
    matched = sorted(required & available)
    missing = sorted(required - available)
    score = len(matched) / len(required) * 100
    return score, {
        "matched": matched,
        "missing": missing,
        "message": f"Matched {len(matched)} of {len(required)} required skills.",
    }


def _qualification_score(profile: JobSeekerProfile, opportunity: Opportunity) -> tuple[float, dict[str, Any]]:
    required = _normalise(opportunity.qualification)
    candidate = _normalise(profile.qualification)
    if not required:
        return 100.0, {"message": "No specific qualification was required."}
    if not candidate:
        return 0.0, {"message": "Add your qualification to improve this comparison."}
    if required in candidate or candidate in required:
        return 100.0, {"message": "Your qualification matches the stated field."}
    required_words = set(required.split())
    candidate_words = set(candidate.split())
    overlap = len(required_words & candidate_words) / max(1, len(required_words))
    score = round(overlap * 100, 2)
    return score, {"message": "Qualification similarity is based on shared field terms."}


def _experience_score(profile: JobSeekerProfile, opportunity: Opportunity) -> tuple[float, dict[str, Any]]:
    required = max(0, opportunity.required_experience_years or 0)
    available = max(0, profile.experience_years or 0)
    if required == 0:
        return 100.0, {"message": "This opportunity does not require previous work experience."}
    score = min(100.0, available / required * 100)
    return score, {"message": f"Profile experience: {available} year(s); required: {required} year(s)."}


def _location_score(profile: JobSeekerProfile, opportunity: Opportunity) -> tuple[float, dict[str, Any]]:
    preferred_mode = _normalise(profile.preferred_work_mode)
    work_mode = _normalise(opportunity.work_mode)
    profile_places = {_normalise(profile.city), _normalise(profile.province)} - {""}
    opportunity_places = {_normalise(opportunity.location), _normalise(opportunity.province)} - {""}
    if work_mode == "remote":
        return 100.0, {"message": "Remote work is available."}
    if preferred_mode in {"", "any"} or preferred_mode == work_mode:
        return 100.0, {"message": "The work arrangement matches your preference."}
    if profile_places & opportunity_places:
        return 100.0, {"message": "The opportunity location matches your profile."}
    return 0.0, {"message": "The saved location or work preference does not match."}


def _profile_completeness_score(profile: JobSeekerProfile) -> tuple[float, dict[str, Any]]:
    checks = {
        "full name": profile.full_name,
        "phone": profile.phone,
        "city": profile.city,
        "province": profile.province,
        "qualification": profile.qualification,
        "institution": profile.institution,
        "professional summary": profile.professional_summary,
        "preferred roles": profile.preferred_roles,
        "skills": profile.skills,
        "projects or experience": profile.projects,
    }
    missing = [name for name, value in checks.items() if not value]
    score = (len(checks) - len(missing)) / len(checks) * 100
    message = "Your matching profile is complete." if not missing else "Complete: " + ", ".join(missing) + "."
    return score, {"missing": missing, "message": message}


def calculate_match(profile: JobSeekerProfile, opportunity: Opportunity) -> dict[str, Any]:
    calculators = {
        "required_skills": lambda: _skills_score(profile, opportunity),
        "qualification": lambda: _qualification_score(profile, opportunity),
        "experience": lambda: _experience_score(profile, opportunity),
        "location": lambda: _location_score(profile, opportunity),
        "profile_completeness": lambda: _profile_completeness_score(profile),
    }
    labels = {
        "required_skills": "Required skills",
        "qualification": "Qualification or field",
        "experience": "Experience",
        "location": "Location preference",
        "profile_completeness": "Profile completeness",
    }
    factors = []
    total = 0.0
    for key, weight in WEIGHTS.items():
        score, details = calculators[key]()
        contribution = score * weight / 100
        total += contribution
        factors.append({
            "key": key,
            "label": labels[key],
            "weight": weight,
            "score": round(score, 2),
            "contribution": round(contribution, 2),
            **details,
        })
    return {
        "opportunity_id": opportunity.id,
        "match_percentage": round(total),
        "factors": factors,
        "advisory_message": (
            "This match is advisory only. It does not make a hiring, rejection or shortlisting decision."
        ),
    }

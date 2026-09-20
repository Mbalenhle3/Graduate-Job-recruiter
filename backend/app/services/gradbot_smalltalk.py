"""Short conversational replies; specific platform questions go to retrieval."""
import re


def respond(message: str, role: str) -> str | None:
    question = re.sub(r"\s+", " ", message.lower().strip())
    question = re.sub(r"[!?.,]+$", "", question).strip()
    if question.startswith("my interview answer:"):
        reply = message.split(":", 1)[1].strip()
        if len(reply) < 25:
            return "Please add a little more detail: what was the situation, what did you do, and what happened?"
        cues = {
            "Situation": ("when ", "during ", "at ", "situation"),
            "Task": ("needed to", "had to", "responsible", "task"),
            "Action": ("i did", "i worked", "i built", "i solved", "i created", "i helped"),
            "Result": ("result", "improved", "achieved", "outcome", "learned", "completed"),
        }
        missing = [part for part, phrases in cues.items() if not any(p in question for p in phrases)]
        feedback = ("Good start. Consider adding: " + ", ".join(missing) + ". " if missing
                    else "Your answer includes the main STAR parts. ")
        return feedback + "Keep your example truthful and explain what you personally did. " + (
            "Disclaimer: GradBot provides advisory guidance only. Matches, CV checks, and interview feedback "
            "do not guarantee employment or constitute recruitment decisions")
    if re.fullmatch(r"(?:hi|hello|hey|hi there|hello there|good (?:morning|afternoon|evening)|sawubona|molo)", question):
        return "Hi! I'm GradBot. I can help with GraduateLink accounts, profiles, applications and opportunities. What would you like help with?"
    if re.fullmatch(r"(?:how are you|how are you doing|how's it going|you good)", question):
        return "I'm here and ready to help. What would you like to know about GraduateLink SA?"
    if re.fullmatch(r"(?:i'm new|i am new|first time here|i'm a first time user|i am a first time user)", question):
        return "Welcome to GraduateLink SA! Choose Job Seeker to look for opportunities or Employer to post them. Start on the home page, create an account, and complete your profile. Which one are you here for?"
    if re.fullmatch(r"(?:who are you|what is your name|what's your name|are you a bot)", question):
        return "I'm GradBot, the GraduateLink SA assistant. I can explain how to use the platform and offer general career guidance."
    if re.fullmatch(r"(?:what can you do|how can you help(?: me)?|what do you do|help|menu)", question):
        extra = {
            "job_seeker": "I can explain your profile, CVs, searching and applying for jobs, and application statuses.",
            "employer": "I can explain organisation verification, opportunity posts and applicant review.",
            "admin": "I can explain employer verification, opportunity review and support processes.",
        }.get(role, "I can explain registration, sign-in and how GraduateLink SA works.")
        return extra + " What would you like to ask?"
    if re.fullmatch(r"(?:thanks|thank you|thank you very much|cheers)", question):
        return "You're welcome! Let me know if you need anything else about GraduateLink SA."
    if re.fullmatch(r"(?:bye|goodbye|see you|good night)", question):
        return "Goodbye! Come back whenever you need help with GraduateLink SA."
    return None

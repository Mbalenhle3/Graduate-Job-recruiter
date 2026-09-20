"""Fast, offline document retrieval. No generative model, Ollama, or network."""
import re
import math
from collections import Counter
from pathlib import Path
from threading import Lock

KB_PATH = Path(__file__).resolve().parents[1] / "knowledge" / "GraduateLink_SA_GradBot_Knowledge_Base.md"
DISCLAIMER = ("Disclaimer: GradBot provides advisory guidance only. Matches, CV checks, "
              "and interview feedback do not guarantee employment or constitute recruitment decisions")
FALLBACK = ("I don't have enough reliable information from GraduateLink SA to answer that "
            "question accurately. Please contact platform support.")
VALID_LINKS = {"/", "/forgot-password", "/appeal", "/support", "/job-seeker/profile",
               "/job-seeker/jobs", "/job-seeker/applications", "/job-seeker/saved",
               "/employer/profile", "/employer/opportunities/new", "/employer/applicants",
               "/admin/employers", "/admin/opportunities", "/admin/users", "/admin/appeals",
               "/admin/reports"}
_lock = Lock()
_cache = None


def _parse():
    text = KB_PATH.read_text(encoding="utf-8")
    entries = []
    for chunk in re.split(r"(?=^### KB-\d+)", text, flags=re.MULTILINE)[1:]:
        chunk = chunk.split("\n## ", 1)[0].strip()
        audience = re.search(r"\*\*Audience:\*\* ([^\n]+)", chunk)
        if not audience:
            continue
        role = audience.group(1).split(" · ", 1)[0].lower()
        lines = chunk.splitlines()
        title = lines[0].split(" — ", 1)[-1]
        # Process instructions are not user-facing answers.
        if title.startswith(("When GradBot cannot answer", "Handling sensitive content", "Example answer style")):
            continue
        search_terms = re.search(r"\*\*Search terms:\*\* ([^\n]+)", chunk)
        aliases = search_terms.group(1) if search_terms else ""
        content = chunk.split("\n\n", 1)[-1].strip()
        # The title and approved search aliases matter more than long answer text.
        search_text = (title + " " + aliases + " ") * 4 + content
        entries.append(dict(role=role, title=title, aliases=aliases,
                            content=content, search_text=search_text))
    return entries


def _index():
    global _cache
    with _lock:
        modified = KB_PATH.stat().st_mtime_ns
        if _cache and _cache[0] == modified:
            return _cache[1:]
        entries = _parse()
        if not entries:
            raise ValueError("The knowledge base has no answer sections")
        documents = [_terms(e["search_text"]) for e in entries]
        frequencies = Counter(term for document in documents for term in set(document))
        idf = {term: math.log((1 + len(documents)) / (1 + count)) + 1
               for term, count in frequencies.items()}
        vectors = [_vector(document, idf) for document in documents]
        _cache = (modified, entries, idf, vectors)
        return _cache[1:]


def _terms(text):
    words = re.findall(r"[a-z0-9]+", text.casefold())
    # Include neighbouring words to distinguish, for example, a password
    # appeal from a password reset.
    return words + [a + "_" + b for a, b in zip(words, words[1:])]


def _vector(terms, idf):
    counts = Counter(terms)
    weights = {term: (1 + math.log(count)) * idf[term]
               for term, count in counts.items() if term in idf}
    magnitude = math.sqrt(sum(weight * weight for weight in weights.values()))
    return {term: value / magnitude for term, value in weights.items()} if magnitude else {}


def _visible(entry, role):
    return entry["role"] == "all" or role.replace("_", " ") in entry["role"]


def _match(question, role):
    entries, idf, vectors = _index()
    query = _vector(_terms(question), idf)
    stop = {"how", "can", "the", "what", "why", "does", "have", "with", "are", "for", "you",
            "your", "from", "this", "help", "please", "want", "need", "me", "my", "to",
            "of", "do", "an", "on", "is", "in", "it", "or", "be", "and", "who"}
    question_words = set(re.findall(r"[a-z]{2,}", question.lower())) - stop
    options = []
    for vector, entry in zip(vectors, entries):
        if not _visible(entry, role):
            continue
        keywords = set(re.findall(r"[a-z]{2,}", (entry["title"] + " " + entry["aliases"]).lower())) - stop
        overlap = question_words & keywords
        if overlap:
            similarity = sum(weight * vector.get(term, 0) for term, weight in query.items())
            options.append((similarity + min(len(overlap), 2) * 0.07, entry))
    return max(options, key=lambda pair: pair[0]) if options else (0, None)


def answer(question: str, role: str):
    score, entry = _match(question, role)
    # For unknown questions, respond honestly instead of returning a random FAQ.
    if not entry or score < 0.10:
        return FALLBACK, ["/support"]
    content = entry["content"]
    # Some entries carry operational caveats; preserve them rather than
    # hallucinating a shorter answer. Remove Markdown styling for plain chat UI.
    content = re.sub(r"\*\*([^*]+)\*\*", r"\1", content)
    content = content.replace("`", "")
    if any(term in question.lower() for term in ("cv", "resume", "interview", "career", "match", "score")):
        if DISCLAIMER not in content:
            content += "\n\n" + DISCLAIMER
    links = list(dict.fromkeys(path for path in re.findall(r"(?<![\w])/[a-z][\w/-]*|(?<!\w)/(?!\w)", content)
                              if path in VALID_LINKS))
    return content, links

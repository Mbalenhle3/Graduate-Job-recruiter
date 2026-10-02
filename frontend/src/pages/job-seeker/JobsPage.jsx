import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Intro } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { getOpportunities, getOpportunityMatches, getSavedOpportunities, saveOpportunity, unsaveOpportunity } from "../../services/platformService";
import JobCard from "./JobCard";
import { toJobView } from "./jobUtils";

export default function JobsPage({ publicMode = false }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]), [saved, setSaved] = useState([]), [matches, setMatches] = useState({}), [query, setQuery] = useState(""), [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => { const requests = publicMode ? [getOpportunities()] : [getOpportunities(), getSavedOpportunities(), getOpportunityMatches()]; Promise.all(requests).then(([rows, savedRows = [], matchRows = []]) => { setJobs(rows.map(toJobView)); setSaved(savedRows.map((item) => String(item.opportunity_id))); setMatches(Object.fromEntries(matchRows.map((item) => [String(item.opportunity_id), item]))); }).catch((requestError) => setError(getApiError(requestError))).finally(() => setLoading(false)); }, [publicMode]);
  const results = useMemo(() => jobs.filter((job) => `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())), [jobs, query]);
  async function toggle(id) { if (publicMode) { navigate("/auth/job-seeker/signin"); return; } try { if (saved.includes(id)) { await unsaveOpportunity(id); setSaved((list) => list.filter((item) => item !== id)); } else { await saveOpportunity(id); setSaved((list) => [...list, id]); } } catch (requestError) { setError(getApiError(requestError)); } }
  return <div className={publicMode?"public-opportunities":""}>{publicMode && <div className="public-jobs-nav"><a href="/">GraduateLink SA</a><button className="button primary small" onClick={()=>navigate("/auth/job-seeker/signin")}>Job seeker sign in</button></div>}<Intro eyebrow={publicMode?"PUBLIC OPPORTUNITIES":"OPPORTUNITIES"} title="Find an opportunity that fits" copy={publicMode?"Browse approved opportunities without signing in. Sign in when you are ready to save or apply.":"Search verified opportunities and review your advisory match."}/><section className="search-panel"><div><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, company or location"/></div></section>{error && <div className="form-error">{error}</div>}{loading ? <div className="panel">Loading opportunities...</div> : <><div className="results"><p><b>{results.length}</b> opportunities found</p></div><div className="job-list single">{results.map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onToggleSaved={toggle} publicMode={publicMode} match={matches[job.id]}/>)}</div></>}</div>;
}

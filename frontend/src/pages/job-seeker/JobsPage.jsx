import { useEffect, useMemo, useState } from "react";
import { Icon, Intro } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { getOpportunities, getSavedOpportunities, saveOpportunity, unsaveOpportunity } from "../../services/platformService";
import JobCard from "./JobCard";
import { toJobView } from "./jobUtils";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]), [saved, setSaved] = useState([]), [query, setQuery] = useState(""), [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => { Promise.all([getOpportunities(), getSavedOpportunities()]).then(([rows, savedRows]) => { setJobs(rows.map(toJobView)); setSaved(savedRows.map((item) => String(item.opportunity_id))); }).catch((requestError) => setError(getApiError(requestError))).finally(() => setLoading(false)); }, []);
  const results = useMemo(() => jobs.filter((job) => `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())), [jobs, query]);
  async function toggle(id) { try { if (saved.includes(id)) { await unsaveOpportunity(id); setSaved((list) => list.filter((item) => item !== id)); } else { await saveOpportunity(id); setSaved((list) => [...list, id]); } } catch (requestError) { setError(getApiError(requestError)); } }
  return <><Intro eyebrow="OPPORTUNITIES" title="Find an opportunity that fits" copy="Search verified opportunities that require little or no experience."/><section className="search-panel"><div><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, company or location"/></div></section>{error && <div className="form-error">{error}</div>}{loading ? <div className="panel">Loading opportunities...</div> : <><div className="results"><p><b>{results.length}</b> opportunities found</p></div><div className="job-list single">{results.map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onToggleSaved={toggle}/>)}</div></>}</>;
}

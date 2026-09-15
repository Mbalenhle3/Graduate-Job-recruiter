import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Intro, Stat } from "../../components/common/AppUI";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../services/api";
import { getJobSeekerDashboard, getOpportunities } from "../../services/platformService";
import JobCard from "./JobCard";
import { toJobView } from "./jobUtils";
function greeting() { const hour = new Date().getHours(); return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"; }
export default function JobSeekerDashboard() {
  const { user } = useAuth(); const [stats, setStats] = useState(null), [jobs, setJobs] = useState([]), [error, setError] = useState("");
  useEffect(() => { Promise.all([getJobSeekerDashboard(), getOpportunities()]).then(([dashboard, opportunities]) => { setStats(dashboard); setJobs(opportunities.slice(0, 3).map(toJobView)); }).catch((requestError) => setError(getApiError(requestError))); }, []);
  return <><Intro eyebrow="JOB SEEKER DASHBOARD" title={`${greeting()}, ${user?.first_name || "Job Seeker"}`} copy="Review your profile, opportunities and applications." action={<Link className="button primary small" to="/job-seeker/jobs">Find opportunities</Link>}/>{error && <div className="form-error">{error}</div>}<div className="stats"><Stat label="Profile strength" value={`${stats?.profile_strength ?? 0}%`} note="Complete your career profile" tone="orange" icon="user"/><Stat label="Available opportunities" value={stats?.available_opportunities ?? 0} note="Published and open" tone="teal" icon="briefcase"/><Stat label="Applications" value={stats?.total_applications ?? 0} note={`${stats?.shortlisted_applications ?? 0} shortlisted`} icon="doc"/><Stat label="Saved opportunities" value={stats?.saved_opportunities ?? 0} note="Review before closing" tone="purple" icon="bookmark"/></div><section className="panel"><h2 className="form-title">Latest opportunities</h2><div className="job-list">{jobs.map((job) => <JobCard key={job.id} job={job} saved={false} onToggleSaved={() => {}}/>)}</div>{jobs.length === 0 && <p>No published opportunities yet.</p>}</section></>;
}

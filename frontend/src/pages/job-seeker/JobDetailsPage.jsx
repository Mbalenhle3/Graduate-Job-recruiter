import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { applyForOpportunity, getOpportunity, getOpportunityMatch, getSavedOpportunities, saveOpportunity, unsaveOpportunity } from "../../services/platformService";
import { Company } from "./JobCard";
import { toJobView } from "./jobUtils";

export default function JobDetailsPage({ publicMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [saved, setSaved] = useState(false);
  const [resume, setResume] = useState(null);
  const [cover, setCover] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const requests = publicMode
      ? [getOpportunity(id)]
      : [getOpportunity(id), getSavedOpportunities(), getOpportunityMatch(id)];
    Promise.all(requests).then(([row, savedRows = [], matchResult = null]) => {
      setJob(toJobView(row));
      setSaved(savedRows.some((item) => String(item.opportunity_id) === String(id)));
      setMatch(matchResult);
    }).catch((requestError) => setError(getApiError(requestError)));
  }, [id, publicMode]);

  async function toggleSaved() {
    if (publicMode) return navigate("/auth/job-seeker/signin");
    try {
      saved ? await unsaveOpportunity(id) : await saveOpportunity(id);
      setSaved(!saved);
    } catch (requestError) { setError(getApiError(requestError)); }
  }

  async function apply(event) {
    event.preventDefault(); setApplying(true); setError("");
    try {
      await applyForOpportunity(id, cover, resume);
      navigate("/job-seeker/applications");
    } catch (requestError) { setError(getApiError(requestError)); }
    finally { setApplying(false); }
  }

  if (!job) return <div className="panel">{error || "Loading opportunity..."}</div>;
  const backPath = publicMode ? "/opportunities" : "/job-seeker/jobs";
  return <div className={publicMode ? "public-opportunities public-detail" : ""}>
    {publicMode && <div className="public-jobs-nav"><Link to="/">GraduateLink SA</Link><Link className="button primary small" to="/auth/job-seeker/signin">Job seeker sign in</Link></div>}
    <div className="breadcrumb"><Link to={backPath}>Opportunities</Link><Icon name="arrow" size={13}/>{job.title}</div>
    {error && <div className="form-error">{error}</div>}
    <section className="panel job-hero"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><h1>{job.title}</h1><p>{job.location} · {job.mode} · {job.type}</p></div><div><button className="button light" onClick={toggleSaved}>{publicMode ? "Sign in to save" : saved ? "Saved" : "Save"}</button></div></section>
    <div className="detail-grid">
      <section className="panel content"><h2>About this opportunity</h2><p>{job.description}</p><h3>Required skills</h3>{job.skills.length ? <div className="job-skills">{job.skills.map((skill)=><span key={skill}>{skill}</span>)}</div> : <p>No specific skills listed.</p>}<h3>Requirements</h3><p>{job.requirements || "See the opportunity description."}</p><h3>Qualification</h3><p>{job.qualification || "Not specified"}</p><h3>Closing date</h3><p>{job.closing}</p></section>
      <aside className="panel match-panel">{publicMode ? <><h2>Interested in this role?</h2><p>Sign in as a job seeker to see your personalised match, save this opportunity and apply.</p><Link className="button primary" to="/auth/job-seeker/signin">Sign in to continue</Link><Link className="button light" to="/auth/job-seeker/signup">Create account</Link></> : <><h2>Your advisory match</h2>{match && <><div className="big-score"><b>{match.match_percentage}%</b><small>profile-to-opportunity match</small></div><div className="match-breakdown">{match.factors.map((factor)=><div key={factor.key}><span>{factor.label}<small>{factor.message}</small></span><b>{factor.contribution}% / {factor.weight}%</b></div>)}</div><p className="match-disclaimer">{match.advisory_message}</p></>}<h2>Apply now</h2><form onSubmit={apply}><label>Short cover letter<textarea rows="6" value={cover} onChange={(event) => setCover(event.target.value)} maxLength="5000"/></label><div className="saved-cv-note"><Icon name="check"/><span><b>Your saved profile CV will be used</b><small>You can select another PDF below if needed.</small></span></div><label>Use a different CV (optional)<input type="file" accept="application/pdf,.pdf" onChange={(event) => setResume(event.target.files?.[0] || null)}/></label>{resume && <small className="cv-selected">Selected: {resume.name}</small>}<button className="button primary" disabled={applying}>{applying ? "Submitting..." : "Submit application"}</button></form></>}</aside>
    </div>
  </div>;
}

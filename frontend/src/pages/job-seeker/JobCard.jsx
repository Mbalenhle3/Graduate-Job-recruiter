import { Link } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";

export function Company({ name }) {
  return <div className="company large">{name.split(" ").map((word) => word[0]).join("").slice(0,2)}</div>;
}

export default function JobCard({ job, saved, onToggleSaved, publicMode = false, match }) {
  const detailsPath = publicMode ? `/opportunities/${job.id}` : `/job-seeker/jobs/${job.id}`;
  return <article className="job-card"><div className="job-top"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><Link to={detailsPath}><h2>{job.title}</h2></Link><p>{job.location} · {job.mode} · {job.type}</p></div><button className={saved?"save saved":"save"} onClick={() => onToggleSaved(job.id)} aria-label={publicMode?"Sign in to save opportunity":"Save opportunity"}><Icon name="bookmark"/></button></div><p className="description">{job.description}</p>{job.skills.length > 0 && <div className="job-skills">{job.skills.slice(0,5).map((skill)=><span key={skill}>{skill}</span>)}</div>}<div className="job-foot"><span>Closes {job.closing}</span>{match && <strong className="job-match">{match.match_percentage}% match</strong>}<Link to={detailsPath}>View details</Link></div></article>;
}

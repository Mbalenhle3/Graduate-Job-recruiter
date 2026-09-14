import { Link } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { matchScore } from "./jobUtils";

export function Company({ name }) {
  return <div className="company large">{name.split(" ").map((word) => word[0]).join("").slice(0,2)}</div>;
}

export default function JobCard({ job, saved, onToggleSaved }) {
  return <article className="job-card"><div className="job-top"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><Link to={`/job-seeker/jobs/${job.id}`}><h2>{job.title}</h2></Link><p>{job.location} · {job.mode} · {job.type}</p></div><button className={saved?"save saved":"save"} onClick={() => onToggleSaved(job.id)}><Icon name="bookmark"/></button></div><p className="description">{job.description}</p><div className="chips">{job.matched.map((skill) => <span className="yes" key={skill}>{skill}</span>)}</div><div className="job-foot"><span>Closes {job.closing}</span><Link to={`/job-seeker/jobs/${job.id}`}><b>{matchScore(job)}% match</b> View details</Link></div></article>;
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { jobs } from "../../data/mockData";
import { Company } from "./JobCard";
import { matchScore } from "./jobUtils";

export default function JobDetailsPage({ saved, onToggleSaved, onApply }) {
  const {id}=useParams(),navigate=useNavigate(),[reported,setReported]=useState(false);
  const job=jobs.find((item) => item.id===id)||jobs[0];
  const missing=job.skills.filter((skill) => !job.matched.includes(skill));
  return <><div className="breadcrumb"><Link to="/job-seeker/jobs">Opportunities</Link><Icon name="arrow" size={13}/>{job.title}</div><section className="panel job-hero"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><h1>{job.title}</h1><p>{job.location} · {job.mode} · {job.type}</p></div><div><button className="button light" onClick={() => onToggleSaved(job.id)}>{saved.includes(job.id)?"Saved":"Save"}</button><button className="button primary" onClick={() => {onApply(job);navigate("/job-seeker/applications")}}>Apply now</button></div></section><div className="detail-grid"><section className="panel content"><h2>About this opportunity</h2><p>{job.description}</p><h3>Requirements</h3><ul><li>{job.qualification}</li><li>{job.experience}</li>{job.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul><h3>Closing date</h3><p>{job.closing}</p><button className="report-action" disabled={reported} onClick={() => setReported(true)}>{reported?"Report sent to the Administrator":"Report suspicious opportunity"}</button></section><aside className="panel match-panel"><span>YOUR MATCH</span><div className="big-score"><b>{matchScore(job)}%</b><small>estimated match</small></div><h3>Matched</h3>{job.matched.map((skill) => <div className="requirement yes" key={skill}><Icon name="check"/><span>{skill}</span></div>)}<h3>Missing</h3>{missing.map((skill) => <div className="requirement no" key={skill}><i>!</i><span>{skill}</span></div>)}</aside></div></>;
}

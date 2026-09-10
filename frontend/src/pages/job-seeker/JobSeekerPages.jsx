import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon, Intro, Stat, Status } from "../../components/common/AppUI";
import { jobs } from "../../data/mockData";

const matchScore = job => Math.round((job.matched.length / job.skills.length) * 70 + 25);

export function JobSeekerDashboard({ applications, savedCount }) {
  return <><Intro eyebrow="JOB SEEKER DASHBOARD" title="Good afternoon, Naledi" copy="Review your profile, matches and recent applications." action={<Link className="button primary small" to="/job-seeker/jobs">Find opportunities</Link>}/><div className="stats"><Stat label="Profile strength" value="82%" note="Add one project" tone="orange" icon="user"/><Stat label="Strong matches" value="3" note="80% or higher" tone="teal" icon="check"/><Stat label="Applications" value={applications.length} note="Track your progress" icon="doc"/><Stat label="Saved opportunities" value={savedCount} note="Review before closing" tone="purple" icon="bookmark"/></div><section className="panel"><h2 className="form-title">Recommended opportunities</h2>{jobs.slice(0,3).map(job=><Link className="compact-job" key={job.id} to={`/job-seeker/jobs/${job.id}`}><Company name={job.company}/><div><h3>{job.title}</h3><p>{job.company} · {job.location}</p><span>{job.type}</span></div><strong>{matchScore(job)}%<small>match</small></strong><Icon name="arrow"/></Link>)}</section></>;
}

export function JobsPage({ saved, onToggleSaved }) {
  const [query,setQuery]=useState(""),[type,setType]=useState("All types"),[mode,setMode]=useState("All work modes");
  const results=useMemo(()=>jobs.filter(job=>(job.title+job.company+job.skills.join(" ")).toLowerCase().includes(query.toLowerCase())&&(type==="All types"||job.type===type)&&(mode==="All work modes"||job.mode===mode)),[query,type,mode]);
  return <><Intro eyebrow="OPPORTUNITIES" title="Find an opportunity that fits" copy="Search verified graduate, internship, learnership and entry-level opportunities."/><section className="search-panel"><div><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search jobs, companies or skills"/></div><select value={type} onChange={e=>setType(e.target.value)}><option>All types</option><option>Graduate programme</option><option>Internship</option><option>Learnership</option><option>Entry-level job</option></select><select value={mode} onChange={e=>setMode(e.target.value)}><option>All work modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></section><div className="results"><p><b>{results.length}</b> opportunities found</p></div><div className="job-list single">{results.map(job=><JobCard key={job.id} job={job} saved={saved.includes(job.id)} onToggleSaved={onToggleSaved}/>)}</div></>;
}

export function JobDetailsPage({ saved, onToggleSaved, onApply }) {
  const { id }=useParams(), navigate=useNavigate(), [reported,setReported]=useState(false);
  const job=jobs.find(item=>item.id===id)||jobs[0], missing=job.skills.filter(skill=>!job.matched.includes(skill));
  return <><div className="breadcrumb"><Link to="/job-seeker/jobs">Opportunities</Link><Icon name="arrow" size={13}/>{job.title}</div><section className="panel job-hero"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><h1>{job.title}</h1><p>{job.location} · {job.mode} · {job.type}</p></div><div><button className="button light" onClick={()=>onToggleSaved(job.id)}>{saved.includes(job.id)?"Saved":"Save"}</button><button className="button primary" onClick={()=>{onApply(job);navigate("/job-seeker/applications")}}>Apply now</button></div></section><div className="detail-grid"><section className="panel content"><h2>About this opportunity</h2><p>{job.description}</p><h3>Requirements</h3><ul><li>{job.qualification}</li><li>{job.experience}</li>{job.skills.map(skill=><li key={skill}>{skill}</li>)}</ul><h3>Closing date</h3><p>{job.closing}</p><button className="report-action" disabled={reported} onClick={()=>setReported(true)}>{reported?"Report sent to the Administrator":"Report suspicious opportunity"}</button></section><aside className="panel match-panel"><span>YOUR MATCH</span><div className="big-score"><b>{matchScore(job)}%</b><small>estimated match</small></div><h3>Matched</h3>{job.matched.map(skill=><div className="requirement yes" key={skill}><Icon name="check"/><span>{skill}</span></div>)}<h3>Missing</h3>{missing.map(skill=><div className="requirement no" key={skill}><i>!</i><span>{skill}</span></div>)}</aside></div></>;
}

export function ApplicationsPage({ applications }) {
  return <><Intro eyebrow="APPLICATION TRACKER" title="Track your applications" copy="Employers update each application status."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{applications.map(app=><tr key={app.id}><td><b>{app.title}</b><span>{app.company}</span></td><td>{app.date}</td><td><Status>{app.status}</Status></td></tr>)}</tbody></table></div></section></>;
}

export function SavedJobsPage({ saved, onToggleSaved }) {
  const list=jobs.filter(job=>saved.includes(job.id));
  return <><Intro eyebrow="SAVED OPPORTUNITIES" title="Review saved opportunities" copy="Saving does not submit an application."/><div className="job-list single">{list.map(job=><JobCard key={job.id} job={job} saved onToggleSaved={onToggleSaved}/>)}</div></>;
}

export function JobSeekerProfilePage() {
  const [saved,setSaved]=useState(false),[cv,setCv]=useState("Naledi_Mthembu_CV.pdf"),[skills,setSkills]=useState(["Python","JavaScript","SQL"]);
  return <><Intro eyebrow="CAREER PROFILE" title="Show employers what you can do" copy="Maintain your personal, education, skills, projects and CV information." action={<button className="button primary small" onClick={()=>setSaved(true)}>{saved?"Profile saved":"Save profile"}</button>}/><section className="panel long-form"><h2 className="form-title">Personal and education details</h2><div className="form-grid"><label>Full name<input defaultValue="Naledi Mthembu"/></label><label>Email<input defaultValue="naledi@example.co.za"/></label><label>Qualification<input defaultValue="BSc Computer Science"/></label><label>Institution<input defaultValue="University of Zululand"/></label></div><h2 className="form-title">Skills</h2><div className="tag-editor">{skills.map(skill=><span key={skill}>{skill} <button onClick={()=>setSkills(items=>items.filter(item=>item!==skill))}>×</button></span>)}<button onClick={()=>{const skill=prompt("Enter a skill");if(skill)setSkills(items=>[...items,skill])}}><Icon name="plus"/>Add skill</button></div><h2 className="form-title">Project</h2><label>Project description<textarea rows="4" defaultValue="Graduate opportunity finder built with React."/></label><h2 className="form-title">CV</h2><div className="item-row"><Icon name="doc"/><span><b>{cv}</b><small>PDF selected for applications</small></span><label className="file-action">Replace CV<input type="file" accept=".pdf" onChange={e=>e.target.files[0]&&setCv(e.target.files[0].name)}/></label></div></section></>;
}

function JobCard({ job, saved, onToggleSaved }) {
  return <article className="job-card"><div className="job-top"><Company name={job.company}/><div><span className="verified-line">{job.company}<em>Approved employer</em></span><Link to={`/job-seeker/jobs/${job.id}`}><h2>{job.title}</h2></Link><p>{job.location} · {job.mode} · {job.type}</p></div><button className={saved?"save saved":"save"} onClick={()=>onToggleSaved(job.id)}><Icon name="bookmark"/></button></div><p className="description">{job.description}</p><div className="chips">{job.matched.map(skill=><span className="yes" key={skill}>{skill}</span>)}</div><div className="job-foot"><span>Closes {job.closing}</span><Link to={`/job-seeker/jobs/${job.id}`}><b>{matchScore(job)}% match</b> View details</Link></div></article>;
}

function Company({ name }) { return <div className="company large">{name.split(" ").map(word=>word[0]).join("").slice(0,2)}</div>; }

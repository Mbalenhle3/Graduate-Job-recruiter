import { useMemo, useState } from "react";
import { Icon, Intro } from "../../components/common/AppUI";
import { jobs } from "../../data/mockData";
import JobCard from "./JobCard";

export default function JobsPage({ saved, onToggleSaved }) {
  const [query,setQuery]=useState(""),[type,setType]=useState("All types"),[mode,setMode]=useState("All work modes");
  const results=useMemo(() => jobs.filter((job) => (job.title+job.company+job.skills.join(" ")).toLowerCase().includes(query.toLowerCase())&&(type==="All types"||job.type===type)&&(mode==="All work modes"||job.mode===mode)),[query,type,mode]);
  return <><Intro eyebrow="OPPORTUNITIES" title="Find an opportunity that fits" copy="Search verified graduate, internship, learnership and entry-level opportunities."/><section className="search-panel"><div><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs, companies or skills"/></div><select value={type} onChange={(event) => setType(event.target.value)}><option>All types</option><option>Graduate programme</option><option>Internship</option><option>Learnership</option><option>Entry-level job</option></select><select value={mode} onChange={(event) => setMode(event.target.value)}><option>All work modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></section><div className="results"><p><b>{results.length}</b> opportunities found</p></div><div className="job-list single">{results.map((job) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onToggleSaved={onToggleSaved}/>)}</div></>;
}

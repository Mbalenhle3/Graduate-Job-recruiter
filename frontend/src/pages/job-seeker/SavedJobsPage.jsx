import { Intro } from "../../components/common/AppUI";
import { jobs } from "../../data/mockData";
import JobCard from "./JobCard";

export default function SavedJobsPage({ saved, onToggleSaved }) {
  const list=jobs.filter((job) => saved.includes(job.id));
  return <><Intro eyebrow="SAVED OPPORTUNITIES" title="Review saved opportunities" copy="Saving does not submit an application."/><div className="job-list single">{list.map((job) => <JobCard key={job.id} job={job} saved onToggleSaved={onToggleSaved}/>)}</div></>;
}

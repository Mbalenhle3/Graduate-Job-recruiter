import { useEffect, useState } from "react";
import { Intro } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { getSavedOpportunities, unsaveOpportunity } from "../../services/platformService";
import JobCard from "./JobCard";
import { toJobView } from "./jobUtils";
export default function SavedJobsPage() {
  const [items, setItems] = useState([]), [error, setError] = useState("");
  useEffect(() => { getSavedOpportunities().then(setItems).catch((requestError) => setError(getApiError(requestError))); }, []);
  async function remove(id) { try { await unsaveOpportunity(id); setItems((list) => list.filter((row) => String(row.opportunity_id) !== String(id))); } catch (requestError) { setError(getApiError(requestError)); } }
  return <><Intro eyebrow="SAVED OPPORTUNITIES" title="Review saved opportunities" copy="Keep promising opportunities together before applying."/>{error && <div className="form-error">{error}</div>}<div className="job-list single">{items.map((item) => { const job = toJobView({ ...item, id: item.opportunity_id, description: "Open the opportunity to view full details." }); return <JobCard key={item.id} job={job} saved onToggleSaved={remove}/>; })}</div>{items.length === 0 && <section className="panel empty"><h2>No saved opportunities</h2><p>Save an opportunity and it will appear here.</p></section>}</>;
}

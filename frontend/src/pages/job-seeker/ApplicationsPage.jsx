import { useEffect, useState } from "react";
import { Intro, Status } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { getMyApplications, withdrawApplication } from "../../services/platformService";
import { pretty } from "./jobUtils";
export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]), [error, setError] = useState("");
  useEffect(() => { getMyApplications().then(setApplications).catch((requestError) => setError(getApiError(requestError))); }, []);
  async function withdraw(id) { if (!confirm("Withdraw this application?")) return; try { await withdrawApplication(id); setApplications((list) => list.map((row) => row.id === id ? { ...row, status: "withdrawn" } : row)); } catch (requestError) { setError(getApiError(requestError)); } }
  return <><Intro eyebrow="APPLICATION TRACKER" title="Track your applications" copy="Employers update each application status."/>{error && <div className="form-error">{error}</div>}<section className="panel"><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>{applications.map((app) => <tr key={app.id}><td><b>{app.opportunity_title}</b><span>{app.organisation_name}</span></td><td>{new Date(app.submitted_at).toLocaleDateString("en-ZA")}</td><td><Status>{pretty(app.status)}</Status></td><td><button className="text-action" disabled={["withdrawn","rejected","hired"].includes(app.status)} onClick={() => withdraw(app.id)}>Withdraw</button></td></tr>)}</tbody></table></div>{applications.length === 0 && <p className="empty">No applications yet.</p>}</section></>;
}

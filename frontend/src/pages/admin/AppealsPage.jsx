import { useEffect, useState } from "react";
import { Intro, Status } from "../../components/common/AppUI";
import { getApiError } from "../../services/api";
import { getAppeals, reviewAppeal } from "../../services/platformService";
export default function AppealsPage() {
  const [items, setItems] = useState([]), [error, setError] = useState("");
  useEffect(() => { getAppeals().then(setItems).catch((e) => setError(getApiError(e))); }, []);
  async function decide(appeal, decision) {
    const reason = window.prompt(`Reason for ${decision === "restore" ? "restoring" : "denying"} this account:`);
    if (!reason?.trim()) return;
    if (!window.confirm(`Confirm ${decision} for ${appeal.email}?`)) return;
    try { const updated = await reviewAppeal(appeal.id, { decision, reason: reason.trim() }); setItems((list) => list.map((item) => item.id === updated.id ? updated : item)); }
    catch (e) { setError(getApiError(e)); }
  }
  return <><Intro eyebrow="ACCOUNT REVIEWS" title="Suspension appeals" copy="Review each request and record the reason for your decision." />{error && <p className="form-error">{error}</p>}<section className="panel"><div className="table-wrap"><table><thead><tr><th>Account</th><th>Appeal</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.email}<br/><small>Case #{item.id}</small></td><td style={{maxWidth:400,whiteSpace:"normal"}}>{item.message}</td><td><Status>{item.status}</Status>{item.decision_reason && <p>{item.decision_reason}</p>}</td><td>{item.status === "pending" && <><button className="text-action" onClick={() => decide(item, "restore")}>Restore</button> <button className="text-action" onClick={() => decide(item, "deny")}>Deny</button></>}</td></tr>)}</tbody></table></div>{!items.length && <p>No appeals yet.</p>}</section></>;
}

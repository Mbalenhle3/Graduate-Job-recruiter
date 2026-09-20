import { useEffect, useState } from "react";
import api, { getApiError } from "../../services/api";
import { Intro } from "../../components/common/AppUI";
export default function SupportRequestsPage() {
 const [items, setItems] = useState([]), [error, setError] = useState("");
 useEffect(() => { api.get("/api/admin/support-requests").then(({data}) => setItems(data)).catch((e) => setError(getApiError(e))); }, []);
 return <><Intro eyebrow="SUPPORT" title="Support requests" copy="Questions that need a human answer." />{error && <p className="form-error">{error}</p>}<section className="panel"><div className="table-wrap"><table><thead><tr><th>Reference</th><th>Email</th><th>Question</th><th>Received</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{item.email}</td><td style={{whiteSpace:"normal",maxWidth:480}}>{item.question}</td><td>{new Date(item.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>{!items.length && <p>No support requests yet.</p>}</section></>;
}

import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../../services/api";
export default function AppealPage() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  const [result, setResult] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setResult("");
    try { const { data } = await api.post("/api/auth/appeals", { email, message }); setResult(data.message); setMessage(""); }
    catch (error) { setResult(getApiError(error)); }
    finally { setBusy(false); }
  }
  return <main className="appeal-page"><h1>Request an account review</h1><p>If your account is suspended, explain why you believe it should be restored. An administrator will review your request and email the result.</p><form onSubmit={submit}><label>Account email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Your appeal<textarea required minLength={20} maxLength={2000} rows={7} value={message} onChange={(e) => setMessage(e.target.value)} /></label><button className="button primary" disabled={busy}>{busy ? "Sending…" : "Submit appeal"}</button></form>{result && <p role="status">{result}</p>}<Link to="/">Back to home</Link></main>;
}

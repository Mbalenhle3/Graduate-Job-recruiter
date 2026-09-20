import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../../services/api";
export default function SupportPage() {
  const [email, setEmail] = useState(""), [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  async function submit(event) {
    event.preventDefault(); setResult("");
    try { const { data } = await api.post("/api/support-requests", { email, question }); setResult(data.message); setQuestion(""); }
    catch (error) { setResult(getApiError(error)); }
  }
  return <main className="appeal-page"><h1>Contact GraduateLink SA support</h1><p>Describe your question. Please do not send passwords or identity documents.</p><form onSubmit={submit}><label>Your email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Your question<textarea minLength={10} maxLength={2000} required value={question} onChange={(e) => setQuestion(e.target.value)} /></label><button className="button primary">Send request</button></form>{result && <p role="status">{result}</p>}<Link to="/">Home</Link></main>;
}

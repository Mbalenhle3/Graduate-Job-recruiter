import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../../services/api";

export default function GradBot() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot" }]);
  async function send(event, preset) {
    event?.preventDefault();
    const question = (preset || draft).trim();
    if (!question || busy) return;
    setDraft(""); setBusy(true);
    setMessages((items) => [...items, { from: "you", text: question }]);
    try {
      const { data } = await api.post("/api/gradbot/chat", { message: question });
      setMessages((items) => [...items, { from: "bot", text: data.answer, links: data.links }]);
    } catch (error) {
      setMessages((items) => [...items, { from: "bot", text: getApiError(error) }]);
    } finally { setBusy(false); }
  }
  return <div className="gradbot-root">
    <button type="button" className="gradbot-launch" onClick={() => setOpen(!open)} aria-label={open ? "Close GradBot" : "Open GradBot"}>💬 GradBot</button>
    {open && <section className="gradbot-window" aria-label="GradBot chat">
      <header><b>GradBot</b><button type="button" onClick={() => setOpen(false)} aria-label="Close">×</button></header>
      <div className="gradbot-messages" aria-live="polite">{messages.map((msg, index) => <div className={`gradbot-message ${msg.from}`} key={index}><p>{msg.text}</p>{msg.links?.map((link) => <Link key={link} to={link} onClick={() => setOpen(false)}>{link}</Link>)}</div>)}{busy && <p>GradBot is responding…</p>}</div>
      <form onSubmit={send}><input aria-label="Ask GradBot" maxLength={2000} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask GradBot…" /><button type="submit" disabled={busy || draft.trim().length < 2}>Send</button></form>
      <small>Do not share passwords or personal documents in chat.</small>
    </section>}
  </div>;
}

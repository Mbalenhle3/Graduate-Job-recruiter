import { useEffect, useState } from "react";
import { getApiError } from "../../services/api";
import { getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from "../../services/platformService";

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false), [items, setItems] = useState([]), [count, setCount] = useState(0), [error, setError] = useState("");
  useEffect(() => { getUnreadCount().then((data) => setCount(data.unread_count)).catch(() => {}); }, []);
  async function toggle() { const next = !open; setOpen(next); setError(""); if (next) try { setItems(await getNotifications({ limit: 20 })); } catch (requestError) { setError(getApiError(requestError)); } }
  async function read(item) { if (!item.is_read) { await markNotificationRead(item.id); setItems((list) => list.map((row) => row.id === item.id ? { ...row, is_read: true } : row)); setCount((value) => Math.max(0, value - 1)); } }
  async function readAll() { await markAllNotificationsRead(); setItems((list) => list.map((row) => ({ ...row, is_read: true }))); setCount(0); }
  return <div className="notification-wrap"><button type="button" className="bell" onClick={toggle} aria-label="Notifications">🔔{count > 0 && <b className="notification-count">{count}</b>}</button>{open && <div className="notification-panel"><div className="notification-head"><b>Notifications</b><button onClick={readAll}>Mark all read</button></div>{error && <p className="form-error">{error}</p>}{items.length === 0 ? <p className="notification-empty">No notifications yet.</p> : items.map((item) => <button key={item.id} className={item.is_read ? "notification-item" : "notification-item unread"} onClick={() => read(item)}><b>{item.title}</b><span>{item.message}</span><small>{new Date(item.created_at).toLocaleString()}</small></button>)}</div>}</div>;
}

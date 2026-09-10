import { Link } from "react-router-dom";

export function Icon({ name="briefcase", size=20 }) {
  const paths = {
    briefcase:<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    shield:<path d="M12 3 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6z"/>,
    chart:<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>,
    bookmark:<path d="M6 3h12v18l-6-4-6 4z"/>,
    check:<path d="m5 12 4 4L19 6"/>, plus:<path d="M12 5v14M5 12h14"/>,
    menu:<path d="M4 7h16M4 12h16M4 17h16"/>, close:<path d="m6 6 12 12M18 6 6 18"/>,
    logout:<><path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10"/></>,
    arrow:<path d="m9 18 6-6-6-6"/>, doc:<><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.briefcase}</svg>;
}

export function Logo() {
  return <Link className="brand" to="/"><span className="brand-mark">G</span><span><b>GraduateLink</b><small>South Africa</small></span></Link>;
}

export function Intro({ eyebrow, title, copy, action }) {
  return <div className="intro"><div><span>{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>;
}

export function Stat({ label, value, note, tone="blue", icon="chart" }) {
  return <article className="stat"><div className={tone}><Icon name={icon}/></div><span><small>{label}</small><b>{value}</b><em>{note}</em></span></article>;
}

export function Status({ children }) {
  const tone = ["Approved","Active","Accepted","Closed"].includes(children) ? "green" : ["Rejected","Suspended","Removed"].includes(children) ? "red" : "orange";
  return <em className={`status ${tone}`}>{children}</em>;
}

export function Field({ label, value="", type="text", required=false }) {
  return <label>{label}<input type={type} defaultValue={value} required={required}/></label>;
}

export function SelectField({ label, options, value, onChange }) {
  return <label>{label}<select value={value} onChange={onChange}>{options.map(option=><option key={option}>{option}</option>)}</select></label>;
}

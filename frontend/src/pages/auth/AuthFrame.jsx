import { Logo } from "../../components/common/AppUI";

export default function AuthFrame({ title, copy, children }) {
  return <div className="auth"><div className="auth-brand"><Logo/><div><span>GRADUATELINK SOUTH AFRICA</span><h1>{title}</h1><p>{copy}</p></div><small>GraduateLink SA · 2026</small></div><div className="auth-wrap">{children}</div></div>;
}

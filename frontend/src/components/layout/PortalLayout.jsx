import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon, Logo } from "../common/AppUI";

const navigation = {
  seeker: [["Overview","/job-seeker/dashboard","chart"],["Find opportunities","/job-seeker/jobs","briefcase"],["Applications","/job-seeker/applications","doc"],["Saved jobs","/job-seeker/saved","bookmark"],["Career profile","/job-seeker/profile","user"]],
  employer: [["Overview","/employer/dashboard","chart"],["My opportunities","/employer/opportunities","briefcase"],["Post opportunity","/employer/opportunities/new","plus"],["Applicants","/employer/applicants","user"],["Organisation profile","/employer/profile","shield"]],
  admin: [["Overview","/admin/dashboard","chart"],["Employer verification","/admin/employers","shield"],["Opportunity review","/admin/opportunities","briefcase"],["Users","/admin/users","user"],["Reports","/admin/reports","doc"]],
};

const roleNames = { seeker:"Job Seeker", employer:"Employer", admin:"Administrator" };
const initials = { seeker:"JS", employer:"EM", admin:"AD" };

export default function PortalLayout({ role, onLogout, children }) {
  const [open,setOpen] = useState(false);
  return <div className="shell">
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="side-head"><Logo/><button onClick={()=>setOpen(false)}><Icon name="close"/></button></div>
      <div className="role-chip"><i className={role}/><span><small>SIGNED IN AS</small><b>{roleNames[role]}</b></span></div>
      <nav>{navigation[role].map(([label,path,icon])=><NavLink key={path} to={path} onClick={()=>setOpen(false)}><Icon name={icon}/>{label}</NavLink>)}</nav>
      <div className="side-foot"><button onClick={onLogout}><Icon name="logout"/>Sign out</button><small>GraduateLink SA Prototype</small></div>
    </aside>
    {open && <button className="backdrop" onClick={()=>setOpen(false)}/>}
    <div className="workspace">
      <header><button className="menu" onClick={()=>setOpen(true)}><Icon name="menu"/></button><div className="global-search"><Icon name="search"/><span>Search GraduateLink</span></div><div className="workspace-actions"><span className="signed-role">{roleNames[role]}</span><button className="bell"><Icon name="bell"/></button><div className="avatar">{initials[role]}</div></div></header>
      <main>{children}</main>
    </div>
  </div>;
}

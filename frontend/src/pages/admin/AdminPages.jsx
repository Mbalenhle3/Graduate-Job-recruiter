import { useState } from "react";
import { Intro, Stat, Status } from "../../components/common/AppUI";

export function AdminDashboard({ employers }) {
  return <><Intro eyebrow="ADMINISTRATOR DASHBOARD" title="Platform trust and activity" copy="Review employers, opportunities, users and reports."/><div className="stats"><Stat label="Registered users" value="1,248" note="86 joined this month" icon="user"/><Stat label="Approved employers" value={employers.filter(item=>item.status==="Approved").length} note={`${employers.filter(item=>item.status==="Pending").length} pending`} tone="teal" icon="shield"/><Stat label="Active opportunities" value="136" note="9 awaiting review" tone="purple" icon="briefcase"/><Stat label="Open reports" value="3" note="Require attention" tone="orange" icon="bell"/></div><section className="panel"><h2 className="form-title">Administration responsibilities</h2><div className="facts"><div><span>Employer verification</span><b>Check company information and documents</b></div><div><span>Opportunity moderation</span><b>Approve or reject submitted listings</b></div><div><span>User management</span><b>Suspend or restore accounts</b></div><div><span>Reports</span><b>Investigate and remove unsafe content</b></div></div></section></>;
}

export function EmployerVerificationPage({ employers, setEmployers }) {
  const decide=(id,status)=>setEmployers(list=>list.map(item=>item.id===id?{...item,status}:item));
  return <><Intro eyebrow="EMPLOYER VERIFICATION" title="Review organisation requests" copy="Approval allows an Employer to publish opportunities."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Organisation</th><th>Document</th><th>Status</th><th>Actions</th></tr></thead><tbody>{employers.map(item=><tr key={item.id}><td><b>{item.name}</b><span>{item.email}</span></td><td>{item.document}</td><td><Status>{item.status}</Status></td><td><div className="row-actions"><button onClick={()=>decide(item.id,"Approved")}>Approve</button><button onClick={()=>decide(item.id,"Rejected")}>Reject</button></div></td></tr>)}</tbody></table></div></section></>;
}

export function OpportunityReviewPage() {
  const [items,setItems]=useState([{id:1,title:"Marketing Graduate Programme",employer:"Ikhaya Energy",status:"Pending"},{id:2,title:"Junior Network Technician",employer:"Connect KZN",status:"Flagged"},{id:3,title:"Graduate Software Developer",employer:"Thrive Digital",status:"Approved"}]);
  const decide=(id,status)=>setItems(list=>list.map(item=>item.id===id?{...item,status}:item));
  return <><Intro eyebrow="OPPORTUNITY REVIEW" title="Moderate submitted opportunities" copy="Approve clear listings and reject or remove misleading content."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><b>{item.title}</b><span>{item.employer}</span></td><td><Status>{item.status}</Status></td><td><div className="row-actions"><button onClick={()=>decide(item.id,"Approved")}>Approve</button><button onClick={()=>decide(item.id,"Rejected")}>Reject</button><button onClick={()=>decide(item.id,"Removed")}>Remove</button></div></td></tr>)}</tbody></table></div></section></>;
}

export function UserManagementPage() {
  const [users,setUsers]=useState([{id:1,name:"Naledi Mthembu",role:"Job Seeker",status:"Active"},{id:2,name:"Thrive Digital",role:"Employer",status:"Active"},{id:3,name:"Sample Account",role:"Job Seeker",status:"Suspended"}]);
  return <><Intro eyebrow="USER MANAGEMENT" title="Manage account access" copy="View roles and suspend or restore accounts."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map(user=><tr key={user.id}><td><b>{user.name}</b></td><td>{user.role}</td><td><Status>{user.status}</Status></td><td><button className="text-action" onClick={()=>setUsers(list=>list.map(item=>item.id===user.id?{...item,status:item.status==="Active"?"Suspended":"Active"}:item))}>{user.status==="Active"?"Suspend":"Restore"}</button></td></tr>)}</tbody></table></div></section></>;
}

export function ReportsPage() {
  const [reports,setReports]=useState([{id:1,title:"Misleading salary",record:"Junior Network Technician",status:"Open"},{id:2,title:"Employer identity concern",record:"Ndlovu Consulting",status:"Investigating"},{id:3,title:"Duplicate listing",record:"Marketing Graduate Programme",status:"Open"}]);
  const decide=(id,status)=>setReports(list=>list.map(item=>item.id===id?{...item,status}:item));
  return <><Intro eyebrow="REPORTS" title="Investigate reported content" copy="Record the outcome and remove unsafe or misleading content."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Report</th><th>Record</th><th>Status</th><th>Actions</th></tr></thead><tbody>{reports.map(report=><tr key={report.id}><td><b>{report.title}</b></td><td>{report.record}</td><td><Status>{report.status}</Status></td><td><div className="row-actions"><button onClick={()=>decide(report.id,"Investigating")}>Investigate</button><button onClick={()=>decide(report.id,"Removed")}>Remove content</button><button onClick={()=>decide(report.id,"Closed")}>Close</button></div></td></tr>)}</tbody></table></div></section></>;
}

import { useState } from "react";
import { Icon, Intro } from "../../components/common/AppUI";

const initialApplicants=[{id:1,name:"Lwazi Khumalo",qualification:"BSc Information Technology",match:"88%",status:"Shortlisted"},{id:2,name:"Ayanda Cele",qualification:"Diploma in ICT",match:"84%",status:"Under review"},{id:3,name:"Sipho Dlamini",qualification:"BSc Computer Science",match:"80%",status:"Applied"}];

export default function ApplicantsPage() {
  const [applicants,setApplicants]=useState(initialApplicants),[selected,setSelected]=useState(null);
  return <><Intro eyebrow="APPLICANTS" title="Review submitted applications" copy="You can only view applicants for your own opportunities."/>{selected&&<div className="success"><Icon name="user"/><span><b>{selected.name}</b> · {selected.qualification} · CV and skills available.</span><button onClick={() => setSelected(null)}>Close</button></div>}<section className="panel"><div className="table-wrap"><table><thead><tr><th>Candidate</th><th>Qualification</th><th>Match</th><th>Status</th><th>Profile</th></tr></thead><tbody>{applicants.map((applicant) => <tr key={applicant.id}><td><b>{applicant.name}</b></td><td>{applicant.qualification}</td><td>{applicant.match}</td><td><select className="status-select" value={applicant.status} onChange={(event) => setApplicants((list) => list.map((row) => row.id===applicant.id?{...row,status:event.target.value}:row))}>{["Applied","Under review","Shortlisted","Interview","Accepted","Rejected"].map((status) => <option key={status}>{status}</option>)}</select></td><td><button className="text-action" onClick={() => setSelected(applicant)}>Review</button></td></tr>)}</tbody></table></div></section></>;
}

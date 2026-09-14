import { useState } from "react";
import { Intro, Status } from "../../components/common/AppUI";

const initialReports = [
  {id:1,title:"Misleading salary",record:"Junior Network Technician",status:"Open"},
  {id:2,title:"Employer identity concern",record:"Ndlovu Consulting",status:"Investigating"},
  {id:3,title:"Duplicate listing",record:"Marketing Graduate Programme",status:"Open"},
];

export default function ReportsPage() {
  const [reports,setReports] = useState(initialReports);
  const decide = (id,status) => setReports((list) => list.map((item) => item.id === id ? {...item,status} : item));

  return <>
    <Intro eyebrow="REPORTS" title="Investigate reported content" copy="Record the outcome and remove unsafe or misleading content."/>
    <section className="panel"><div className="table-wrap"><table>
      <thead><tr><th>Report</th><th>Record</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{reports.map((report) => <tr key={report.id}>
        <td><b>{report.title}</b></td><td>{report.record}</td><td><Status>{report.status}</Status></td>
        <td><div className="row-actions"><button onClick={() => decide(report.id,"Investigating")}>Investigate</button><button onClick={() => decide(report.id,"Removed")}>Remove content</button><button onClick={() => decide(report.id,"Closed")}>Close</button></div></td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}

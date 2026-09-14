import { Intro, Status } from "../../components/common/AppUI";

export default function EmployerVerificationPage({ employers, setEmployers }) {
  const decide = (id, status) => setEmployers((list) => list.map((item) => item.id === id ? {...item, status} : item));

  return <>
    <Intro eyebrow="EMPLOYER VERIFICATION" title="Review organisation requests" copy="Approval allows an Employer to publish opportunities."/>
    <section className="panel"><div className="table-wrap"><table>
      <thead><tr><th>Organisation</th><th>Document</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{employers.map((item) => <tr key={item.id}>
        <td><b>{item.name}</b><span>{item.email}</span></td><td>{item.document}</td><td><Status>{item.status}</Status></td>
        <td><div className="row-actions"><button onClick={() => decide(item.id,"Approved")}>Approve</button><button onClick={() => decide(item.id,"Rejected")}>Reject</button></div></td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}

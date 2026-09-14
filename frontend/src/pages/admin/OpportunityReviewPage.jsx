import { useState } from "react";
import { Intro, Status } from "../../components/common/AppUI";

const initialItems = [
  {id:1,title:"Marketing Graduate Programme",employer:"Ikhaya Energy",status:"Pending"},
  {id:2,title:"Junior Network Technician",employer:"Connect KZN",status:"Flagged"},
  {id:3,title:"Graduate Software Developer",employer:"Thrive Digital",status:"Approved"},
];

export default function OpportunityReviewPage() {
  const [items,setItems] = useState(initialItems);
  const decide = (id,status) => setItems((list) => list.map((item) => item.id === id ? {...item,status} : item));

  return <>
    <Intro eyebrow="OPPORTUNITY REVIEW" title="Moderate submitted opportunities" copy="Approve clear listings and reject or remove misleading content."/>
    <section className="panel"><div className="table-wrap"><table>
      <thead><tr><th>Opportunity</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}>
        <td><b>{item.title}</b><span>{item.employer}</span></td><td><Status>{item.status}</Status></td>
        <td><div className="row-actions"><button onClick={() => decide(item.id,"Approved")}>Approve</button><button onClick={() => decide(item.id,"Rejected")}>Reject</button><button onClick={() => decide(item.id,"Removed")}>Remove</button></div></td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}

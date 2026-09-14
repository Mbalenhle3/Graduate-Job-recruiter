import { Status } from "../../components/common/AppUI";

export default function OpportunityTable({ opportunities, actions }) {
  return <div className="table-wrap"><table>
    <thead><tr><th>Opportunity</th><th>Applicants</th><th>Closing</th><th>Status</th>{actions&&<th>Actions</th>}</tr></thead>
    <tbody>{opportunities.map((item) => <tr key={item.id}>
      <td><b>{item.title}</b><span>{item.location}</span></td><td>{item.applicants}</td><td>{item.closing}</td><td><Status>{item.status}</Status></td>
      {actions&&<td><div className="row-actions"><button onClick={() => actions.edit(item)}>Edit</button><button disabled={item.status==="Closed"} onClick={() => actions.close(item)}>Close</button></div></td>}
    </tr>)}</tbody>
  </table></div>;
}

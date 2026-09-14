import { useState } from "react";
import { Intro, Status } from "../../components/common/AppUI";

const initialUsers = [
  {id:1,name:"Naledi Mthembu",role:"Job Seeker",status:"Active"},
  {id:2,name:"Thrive Digital",role:"Employer",status:"Active"},
  {id:3,name:"Sample Account",role:"Job Seeker",status:"Suspended"},
];

export default function UserManagementPage() {
  const [users,setUsers] = useState(initialUsers);
  const toggle = (id) => setUsers((list) => list.map((item) => item.id === id ? {...item,status:item.status === "Active" ? "Suspended" : "Active"} : item));

  return <>
    <Intro eyebrow="USER MANAGEMENT" title="Manage account access" copy="View roles and suspend or restore accounts."/>
    <section className="panel"><div className="table-wrap"><table>
      <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{users.map((user) => <tr key={user.id}>
        <td><b>{user.name}</b></td><td>{user.role}</td><td><Status>{user.status}</Status></td>
        <td><button className="text-action" onClick={() => toggle(user.id)}>{user.status === "Active" ? "Suspend" : "Restore"}</button></td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}

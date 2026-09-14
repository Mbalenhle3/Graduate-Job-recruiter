import { Intro, Status } from "../../components/common/AppUI";

export default function ApplicationsPage({ applications }) {
  return <><Intro eyebrow="APPLICATION TRACKER" title="Track your applications" copy="Employers update each application status."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{applications.map((app) => <tr key={app.id}><td><b>{app.title}</b><span>{app.company}</span></td><td>{app.date}</td><td><Status>{app.status}</Status></td></tr>)}</tbody></table></div></section></>;
}

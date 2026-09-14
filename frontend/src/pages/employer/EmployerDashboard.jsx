import { Link } from "react-router-dom";
import { Icon, Intro, Stat } from "../../components/common/AppUI";
import OpportunityTable from "./OpportunityTable";

export default function EmployerDashboard({ opportunities }) {
  return <>
    <Intro eyebrow="EMPLOYER DASHBOARD" title="Good afternoon, Thandi" copy="Manage your organisation, opportunities and applicants." action={<Link className="button primary small" to="/employer/opportunities/new"><Icon name="plus"/>Post opportunity</Link>}/>
    <div className="verification"><Icon name="shield"/><span><b>Organisation approved</b><p>Your organisation was reviewed by an Administrator.</p></span><em>Approved</em></div>
    <div className="stats"><Stat label="Active opportunities" value={opportunities.filter((item) => item.status==="Active").length} note="Published listings" icon="briefcase"/><Stat label="Total applicants" value={opportunities.reduce((sum,item) => sum+item.applicants,0)} note="Across your listings" tone="teal" icon="user"/><Stat label="Verification" value="Approved" note="Publishing allowed" tone="purple" icon="shield"/></div>
    <section className="panel"><h2 className="form-title">Recent opportunities</h2><OpportunityTable opportunities={opportunities}/></section>
  </>;
}

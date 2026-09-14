import { Intro, Stat } from "../../components/common/AppUI";

export default function AdminDashboard({ employers }) {
  const approved = employers.filter((item) => item.status === "Approved").length;
  const pending = employers.filter((item) => item.status === "Pending").length;

  return <>
    <Intro eyebrow="ADMINISTRATOR DASHBOARD" title="Platform trust and activity" copy="Review employers, opportunities, users and reports."/>
    <div className="stats">
      <Stat label="Registered users" value="1,248" note="86 joined this month" icon="user"/>
      <Stat label="Approved employers" value={approved} note={`${pending} pending`} tone="teal" icon="shield"/>
      <Stat label="Active opportunities" value="136" note="9 awaiting review" tone="purple" icon="briefcase"/>
      <Stat label="Open reports" value="3" note="Require attention" tone="orange" icon="bell"/>
    </div>
    <section className="panel">
      <h2 className="form-title">Administration responsibilities</h2>
      <div className="facts">
        <div><span>Employer verification</span><b>Check company information and documents</b></div>
        <div><span>Opportunity moderation</span><b>Approve or reject submitted listings</b></div>
        <div><span>User management</span><b>Suspend or restore accounts</b></div>
        <div><span>Reports</span><b>Investigate and remove unsafe content</b></div>
      </div>
    </section>
  </>;
}

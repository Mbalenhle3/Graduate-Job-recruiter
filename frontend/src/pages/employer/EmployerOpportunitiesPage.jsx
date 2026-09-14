import { Link } from "react-router-dom";
import { Intro } from "../../components/common/AppUI";
import OpportunityTable from "./OpportunityTable";

export default function EmployerOpportunitiesPage({ opportunities, setOpportunities }) {
  function edit(item) { const title=prompt("Update opportunity title",item.title); if(title)setOpportunities((list) => list.map((row) => row.id===item.id?{...row,title}:row)); }
  function close(item) { setOpportunities((list) => list.map((row) => row.id===item.id?{...row,status:"Closed"}:row)); }
  return <><Intro eyebrow="MY OPPORTUNITIES" title="Manage your opportunities" copy="Edit or close opportunities belonging to your organisation." action={<Link className="button primary small" to="/employer/opportunities/new">Post opportunity</Link>}/><section className="panel"><OpportunityTable opportunities={opportunities} actions={{edit,close}}/></section></>;
}

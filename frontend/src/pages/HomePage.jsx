import { Link } from "react-router-dom";
import { Icon, Logo } from "../components/common/AppUI";

const roles = [
  { key: "job-seeker", title: "Job Seeker", icon: "user", copy: "Find verified graduate, internship, learnership and entry-level opportunities.", signup: true },
  { key: "employer", title: "Employer", icon: "briefcase", copy: "Create an organisation profile, post opportunities and manage applicants.", signup: true },
  { key: "admin", title: "Administrator", icon: "shield", copy: "Review employers, opportunities, users and platform activity.", signup: false },
];

export default function HomePage() {
  return <div className="public-page role-home">
    <header className="public-header"><div className="public-nav"><Logo/><nav><a href="#roles">Choose account</a><a href="#about">How it works</a></nav><div className="header-actions"><Link to="/auth/job-seeker/signin"></Link></div></div></header>
    <main>
      <section className="role-hero"><span>GRADUATELINK SOUTH AFRICA</span><h1>Choose how you want to use GraduateLink</h1><p>Start in the correct area so your account, tools and dashboard stay organised.</p></section>
      <section id="roles" className="role-choice-grid">
        {roles.map((role) => <article key={role.key} className={`role-choice ${role.key}`}><div><Icon name={role.icon} size={28}/></div><h2>{role.title}</h2><p>{role.copy}</p><Link className="button primary" to={`/auth/${role.key}/signin`}>Continue as {role.title}</Link>{role.signup ? <Link className="role-create" to={`/auth/${role.key}/signup`}>Create {role.title} account</Link> : <small></small>}</article>)}
      </section>
      <section id="about" className="home-process"><h2>One platform, three clear areas</h2><p>Job seekers apply, employers recruit, and administrators keep the platform trusted.</p></section>
    </main>
    <footer><Logo/><p>GraduateLink SA · Early-career opportunities without unnecessary experience barriers.</p></footer>
  </div>;
}

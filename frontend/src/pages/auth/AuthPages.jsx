import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon, Logo } from "../../components/common/AppUI";
import { ROLE_HOME } from "../../data/mockData";

export function SignInPage({ onSignIn }) {
  const [role,setRole] = useState("seeker");
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    onSignIn(role);
    navigate(ROLE_HOME[role]);
  }
  return <AuthFrame title="Welcome to GraduateLink SA" copy="Sign in before accessing opportunities or role tools.">
    <form onSubmit={submit}>
      <span></span><h2>Continue to your account</h2><p></p>
      <label>Email address<input type="email" required placeholder="name@example.co.za"/></label>
      <label>Password<input type="password" minLength="8" required placeholder="At least 8 characters"/></label>
      <label>Account role<select value={role} onChange={event=>setRole(event.target.value)}><option value="seeker">Job Seeker</option><option value="employer">Employer</option><option value="admin">Administrator</option></select></label>
      <button className="button primary">Sign in</button>
      <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
      <small>Do not have an account? <Link to="/register">Create account</Link></small>
    </form>
  </AuthFrame>;
}

export function RegisterPage({ onSignIn }) {
  const [role,setRole] = useState("seeker");
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    onSignIn(role);
    navigate(ROLE_HOME[role]);
  }
  return <AuthFrame title="Create your GraduateLink account" copy="Register as a Job Seeker or Employer. Administrator accounts are created internally.">
    <form onSubmit={submit}>
      <span></span><h2></h2>
      <label>Account type<select value={role} onChange={event=>setRole(event.target.value)}><option value="seeker">Job Seeker</option><option value="employer">Employer</option></select></label>
      <label>{role==="employer" ? "Contact person" : "Full name"}<input required placeholder="Enter full name"/></label>
      {role==="employer" && <label>Organisation name<input required placeholder="Registered company name"/></label>}
      <label>Email address<input type="email" required placeholder="name@example.co.za"/></label>
      <label>Password<input type="password" minLength="8" required placeholder="At least 8 characters"/></label>
      {role==="employer" && <div className="auth-note"><Icon name="shield"/><span>Your organisation must be verified before it can publish opportunities.</span></div>}
      <button className="button primary">Create account</button>
      <small>Already registered? <Link to="/login">Sign in</Link></small>
    </form>
  </AuthFrame>;
}

export function ForgotPasswordPage() {
  const [sent,setSent] = useState(false);
  return <AuthFrame title="Reset your password" copy="Recover access to your GraduateLink account.">
    <form onSubmit={event=>{event.preventDefault();setSent(true)}}>
      <span></span><h2>Forgot password?</h2>
      {sent ? <div className="success"><Icon name="check"/>Reset instructions were sent to your email.</div> : <><p>Enter the email connected to your account.</p><label>Email address<input type="email" required placeholder="name@example.co.za"/></label><button className="button primary">Send reset link</button></>}
      <small><Link to="/login">Return to sign in</Link></small>
    </form>
  </AuthFrame>;
}

function AuthFrame({ title, copy, children }) {
  return <div className="auth"><div className="auth-brand"><Logo/><div><span>GRADUATELINK SOUTH AFRICA</span><h1>{title}</h1><p>{copy}</p></div><small>GraduateLink SA · 2026</small></div><div className="auth-wrap">{children}</div></div>;
}

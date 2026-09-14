import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../components/common/AppUI";
import { ROLE_HOME } from "../../data/mockData";
import AuthFrame from "./AuthFrame";

export default function RegisterPage({ onSignIn }) {
  const [role,setRole]=useState("seeker");
  const navigate=useNavigate();
  function submit(event) { event.preventDefault(); onSignIn(role); navigate(ROLE_HOME[role]); }
  return <AuthFrame title="Create your GraduateLink account" copy="Register as a Job Seeker or Employer. Administrator accounts are created internally."><form onSubmit={submit}><span></span><h2></h2><label>Account type<select value={role} onChange={(event) => setRole(event.target.value)}><option value="seeker">Job Seeker</option><option value="employer">Employer</option></select></label><label>{role==="employer"?"Contact person":"Full name"}<input required placeholder="Enter full name"/></label>{role==="employer"&&<label>Organisation name<input required placeholder="Registered company name"/></label>}<label>Email address<input type="email" required placeholder="name@example.co.za"/></label><label>Password<input type="password" minLength="8" required placeholder="At least 8 characters"/></label>{role==="employer"&&<div className="auth-note"><Icon name="shield"/><span>Your organisation must be verified before it can publish opportunities.</span></div>}<button className="button primary">Create account</button><small>Already registered? <Link to="/login">Sign in</Link></small></form></AuthFrame>;
}
